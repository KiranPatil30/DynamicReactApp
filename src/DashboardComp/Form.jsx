import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  TextInput,
  EmailInput,
  MobileInput,
  SelectInput,
  TextareaInput,
  NumberInput,
  FileInput,
} from "./Inputfile";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import { getDataApi } from "./API Folder/ApiFile";

const Form = () => {
  const [formData, setFormData] = useState({
    type: "",
    label: "",
    placeholder: "",
    required: null,
  });
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { eventId } = useParams();
  const [eventTitle, setEventTitle] = useState(""); // State to hold the event title

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await getDataApi();
        console.log("API Response:", response);

        // Adjust based on your actual response structure
        console.log(response.records);
        const eventsArray = Array.isArray(response)
          ? response
          : response.records;

        const event = eventsArray.find((event) => event.sEventId === eventId);
        console.log(event);
        if (event) {
          setEventTitle(event.sEventTitle);
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updatedItems = items.map((item, index) =>
        index === editIndex ? formData : item
      );
      setItems(updatedItems);
      console.log("Updated Items:", updatedItems);
      setEditIndex(null);
      setFormData({
        type: "",
        label: "",
        placeholder: "",
        required: null,
      });
    } else {
      const newItems = [...items, formData];
      setItems(newItems);
      console.log("Updated Items:", newItems);
      setFormData({ type: "", label: "", placeholder: "", required: null });
    }
  };

  const handleEdit = (index) => {
    setFormData(items[index]);
    setEditIndex(index);
  };

  const DynamicForm = ({ formConfig }) => {
    const [dynamicFormData, setDynamicFormData] = useState(
      formConfig.reduce((acc, field) => {
        acc[field.label] = "";
        return acc;
      }, {})
    );

    const handleChanged = (e) => {
      const { name, value } = e.target;
      setDynamicFormData({ ...dynamicFormData, [name]: value });
    };

    const handleSubmitd = async (e) => {
      e.preventDefault();

      // Create the JSON structure for sRegistrationLink
      const sRegistrationLink = [
        {
          type: "text",
          label: "Full Name",
          placeholder: "Enter Full Name",
          required: "1",
          value: dynamicFormData.fullName,
        },
        {
          type: "email",
          label: "Email",
          placeholder: "Enter Email",
          required: "1",
          value: dynamicFormData.emailId,
        },
        {
          type: "mob",
          label: "Mobile Number",
          placeholder: "Enter a Mobile Number",
          required: "1",
          value: dynamicFormData.mobileNumber,
        },
        {
          type: "num",
          label: "Amount",
          placeholder: "Enter Amount",
          required: "1",
          value: dynamicFormData.amount,
        },
        ...formConfig.map((field) => ({
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          value: dynamicFormData[field.label] || "",
        })),
      ];

      console.log("sRegistrationLink JSON Data:", sRegistrationLink); // Log the sRegistrationLink data

      const json = {
        sEventId: eventId,
        sRegistrationLink: sRegistrationLink, // Attach the sRegistrationLink JSON here
      };

      console.log("Full Form Data:", json); // Show full form data in console

      try {
        const response = await axios.post(
          "https://mysoftway.com/eventreg/webservice.php?action=updateEventLink",
          json,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("dddd", response.data.records);
        if (response.data.result == "2") {
          window.alert("Done");
          navigate("/Home/payment");
        }
        console.log("API Response:", response);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const renderField = (field, index) => {
      switch (field.type) {
        case "text":
          return (
            <div
              key={index}
              className="row mb-3 align-items-center"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-10">
                <TextInput
                  {...field}
                  name={field.label}
                  value={dynamicFormData[field.label]}
                  onChange={handleChanged}
                />
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm shadow"
                  onClick={() => handleEdit(index)}
                  type={field.type}
                  style={{ marginTop: "22px", height: "35px" }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        case "email":
          return (
            <div
              key={index}
              className="row mb-3 align-items-center"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-10">
                <EmailInput
                  name={field.label}
                  type={field.type}
                  {...field}
                  value={dynamicFormData[field.label]}
                  onChange={handleChanged}
                />
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm shadow"
                  onClick={() => handleEdit(index)}
                  type={field.type}
                  style={{ marginTop: "22px", height: "35px" }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        case "mob":
          return (
            <div
              key={index}
              className="row mb-3 align-items-center"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-10">
                <MobileInput
                  {...field}
                  name={field.label}
                  type={field.type}
                  value={dynamicFormData[field.label]}
                  onChange={handleChanged}
                />
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm shadow"
                  onClick={() => handleEdit(index)}
                  type={field.type}
                  style={{ marginTop: "22px", height: "35px" }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        case "select":
          return (
            <SelectInput
              type={field.type}
              key={index}
              {...field}
              value={dynamicFormData[field.name] || ""}
              onChange={handleChanged}
            />
          );
        case "mtext":
          return (
            <div
              key={index}
              className="row mb-3 align-items-center"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-10">
                <TextareaInput
                  {...field}
                  name={field.label}
                  value={dynamicFormData[field.label]}
                  onChange={handleChanged}
                />
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm shadow"
                  onClick={() => handleEdit(index)}
                  type={field.type}
                  style={{ marginTop: "22px", height: "35px" }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        case "num":
          return (
            <div
              key={index}
              className="row mb-3 align-items-center"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-10">
                <NumberInput
                  key={field.name}
                  name={field.label}
                  {...field}
                  value={formData[field.name]}
                  onChange={handleChanged}
                />
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm shadow"
                  onClick={() => handleEdit(index)}
                  type={field.type}
                  style={{ marginTop: "22px", height: "35px" }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        case "file":
          return (
            <div
              key={index}
              className="row mb-3 align-items-center"
              style={{ width: "100%" }}
            >
              <div className="col-12 col-md-10 ">
                <FileInput
                  key={field.name}
                  name={field.label}
                  {...field}
                  onChange={handleChanged}
                  style={{ border: "2px red solid" }}
                />
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-center">
                <button
                  className="btn btn-secondary btn-sm shadow"
                  onClick={() => handleEdit(index)}
                  type={field.type}
                  style={{ marginTop: "22px", height: "35px" }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        {/* <form
          onSubmit={handleSubmitd}
          className="square border shadow p-3 "
          style={{
            height: "100%",
            margin: " 0px",
            overflowY: "scroll",
            padding: "100px 0px",
          }}
        > */}
        {/* {formConfig.length > 0 ? (
            formConfig.map((field, index) => renderField(field, index))
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                // height: "100px",
                // backgroundColor: "#000",
                // color: "black",
                fontSize: "18px",
              }}
            >
              {/* <img
        src="https://cdn.vectorstock.com/i/1000v/48/27/no-items-found-something-went-wrong-template-vector-31554827.avif"
        alt="Trees"
        height="200"
      /> * /}
              <h1>No Item here !!!!!!!!!!</h1>
            </div>
          )} */}
        {/* {formConfig.length > 0 && (
            <button
              style={{}}
              type="submit"
              className="btn btn-primary shadow-lg"
            >
              Submit
            </button>
          )} */}

        <form
          onSubmit={handleSubmitd}
          className="square border shadow p-3 "
          style={{
            height: "100%",
            margin: " 0px",
            overflowY: "scroll",
            padding: "100px 0px",
          }}
        >
          <div className="form-group" style={{ width: "96%" }}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              value={dynamicFormData.fullName}
              onChange={handleChanged}
              placeholder="Full Name"
            />
          </div>

          <div className="form-group" style={{ width: "96%" }}>
            <label htmlFor="emailId">Email ID</label>
            <input
              type="email"
              id="emailId"
              name="emailId"
              className="form-control"
              value={dynamicFormData.emailId}
              onChange={handleChanged}
              placeholder="Email ID"
            />
          </div>

          <div className="form-group" style={{ width: "96%" }}>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              className="form-control"
              value={dynamicFormData.mobileNumber}
              onChange={handleChanged}
              placeholder="Mobile Number"
            />
          </div>

          <div className="form-group" style={{ width: "96%" }}>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-control"
              value={dynamicFormData.amount}
              onChange={handleChanged}
              placeholder="Amount"
            />
          </div>

          {formConfig.map((field, index) => renderField(field, index))}

          <button
            type="submit"
            className="btn btn-primary mt-2"
            onClick={handleSubmitd}
          >
            Submit
          </button>
        </form>
        {/* </form> */}
      </>
    );
  };

  return (
    <div
      className="container-fluid mt-3"
      style={{ width: "1200px", height: "95vh" }}
    >
      <div className="row">
        <div className="col-md-6 mb-4" style={{ height: "90vh" }}>
          <div
            className="shadow p-3 border rounded"
            style={{
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ margin: "0.5rem 0rem 1rem 0.2rem" }}>
              {eventTitle ? eventTitle : "Loading event..."}
            </h2>
            <h4 style={{ margin: "0.5rem 0rem 1rem 0.2rem" }}>Form App</h4>
            <form
              onSubmit={handleSubmit}
              className="mb-4"
              style={{ padding: "5px" }}
            >
              <div
                className="mb-3"
                style={{ width: "100%", marginBottom: "1.5rem" }}
              >
                <label className="form-label">Type</label>
                <select
                  value={formData.type || ""}
                  className="form-control"
                  name="type"
                  onChange={handleInputChange}
                >
                  <option value="">Select a Type</option>
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="mob">Mobile</option>
                  <option value="mtext">Multi-line Text</option>
                  <option value="num">Number</option>
                  <option value="file">File</option>
                </select>
              </div>
              <div
                className="mb-3"
                style={{ width: "100%", marginBottom: "1.5rem" }}
              >
                <label className="form-label">Label</label>
                <input
                  type="text"
                  value={formData.label || ""}
                  className="form-control"
                  name="label"
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="mb-3"
                style={{ width: "100%", marginBottom: "1.5rem" }}
              >
                <label className="form-label">Placeholder</label>
                <input
                  type="text"
                  value={formData.placeholder || ""}
                  className="form-control"
                  name="placeholder"
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="mb-3"
                style={{ width: "100%", marginBottom: "1.5rem" }}
              >
                <label className="form-label">Required</label>
                <select
                  value={formData.required || ""}
                  className="form-control"
                  name="required"
                  onChange={handleInputChange}
                >
                  <option value={null}>Select Requirement</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                {editIndex !== null ? "Update Item" : "Add Item"}
              </button>
            </form>
          </div>
        </div>
        {/* <div className="col-md-6">
          {items.length > 0 ? (
            <DynamicForm formConfig={items} />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                // height: "300px",
                // backgroundColor: "#000",
                color: "black",
                fontSize: "24px",
              }}
            >
              <p>No items to preview</p>
            </div>
          )}
        </div> */}
        <div className="col-md-6 mb-4" style={{ height: "90vh" }}>
          <div
            style={{
              // border: items.length === 0 ? "5px gray dashed" : "none",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <DynamicForm formConfig={items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
