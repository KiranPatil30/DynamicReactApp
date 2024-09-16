import React, { useState, useEffect } from "react";
import "../DynamicFormFolder/dynamicform.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDataApi } from "../API Folder/ApiFile";

const DynamicForm = ({ eventIdU }) => {
  const location = useLocation(); // Get the current location object
  const { eventId } = useParams();
  const eventId1 = eventId || eventIdU;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    label: "",
    placeholder: "",
    required: null,
  });
  const [jsonData, setJsonData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [eventTitle, setEventTitle] = useState(""); // State to hold the event title
  const [showBackButton, setShowBackButton] = useState(false); // State to control button visibility

  useEffect(() => {
    if (location.state && location.state.from === "AddButton") {
      setShowBackButton(true); // Show the button if navigated from another page
    } else {
      setShowBackButton(false); // Hide the button if it's a direct link
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://mysoftway.com/eventreg/webservice.php?action=getEventByEventId",
          { sEventId: eventId1 },
          { headers: { "Content-Type": "application/json" } }
        );

        let fetchedData = response.data.records[0].sRegistrationLink;

        try {
          fetchedData = JSON.parse(fetchedData);
          setJsonData(fetchedData);
        } catch (error) {
          // console.warn("sRegistrationLink is not a JSON string:", fetchedData);
          setJsonData([]);
        }

        setFormValues(
          fetchedData.reduce((acc, field) => {
            acc[field.label] = "";
            return acc;
          }, {})
        );

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error);
        setLoading(false);
      }
    };
    const fetchEventDetails = async () => {
      try {
        const response = await getDataApi();
        const eventsArray = Array.isArray(response)
          ? response
          : response.records;

        const event = eventsArray.find((event) => event.sEventId === eventId1);
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
    fetchData();
  }, [eventId1]);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleAddField = (event) => {
    event.preventDefault();

    const filteredJsonData = jsonData.filter(
      (item) => item.label.trim() !== "" && item.type.trim() !== ""
    );

    let updatedJsonData = [...filteredJsonData];

    if (editIndex !== null) {
      // Edit existing field
      updatedJsonData[editIndex] = { ...formData };
      window.alert("Field updated successfully");
    } else {
      // Add new field
      if (formData.label.trim() !== "" && formData.type.trim() !== "") {
        updatedJsonData.push({ ...formData });
        window.alert("Field added");
        setFormData({
          type: "",
          label: "",
          placeholder: "",
          required: null,
        });
      }
    }

    setJsonData(updatedJsonData);

    // Reset form and editIndex
    setFormData({
      type: "",
      label: "",
      placeholder: "",
      required: "",
    });
    setEditIndex(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const json = {
      sEventId: eventId1,
      sRegistrationLink: jsonData,
    };
    console.log("Final", json);
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

      if (response.data.result === "2") {
        toast.success("Form updated successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const fieldToEdit = jsonData[index];
    setFormData(fieldToEdit);
  };

  const handleRemove = (index) => {
    const updatedJsonData = jsonData.filter((_, i) => i !== index);
    setJsonData(updatedJsonData);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;

  return (
    <div
      className="container-fluid mt-3"
      style={{ width: "1200px", height: "95vh" }}
    >
      <ToastContainer />

      <div className="row">
        <div className="col-12  d-flex flex-column flex-md-row justify-content-start align-items-start">
          {showBackButton && (
            <button
              onClick={() => {
                navigate(-1);
              }}
              className=""
              style={{ background: "#F86F03", borderRadius: "4px" }}
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
          )}
          <h2
            style={{
              margin: "0.3rem 0rem 1rem 0.2rem",
              textAlign: "start",
              flex: "1",
            }}
            className="text-start" // Use Bootstrap text alignment class
          >
            {eventTitle ? eventTitle : "Loading event..."}
          </h2>
        </div>

        <div style={{ display: "flex" }} className="border rounded">
          <div className="col-md-6">
            <div
              className=""
              style={{ height: "90vh", overflowY: "scroll", width: "100%" }}
            >
              {jsonData.length > 0 ? (
                <form
                  onSubmit={handleSubmit}
                  style={{ margin: "15px", padding: "0px" }}
                >
                  {jsonData.map((field, index) => (
                    <div key={index} className="mb-3" style={{ width: "100%" }}>
                      <div></div>
                      <label>{field.label}</label>
                      <div
                        className="form-group mb-3"
                        style={{ display: "flex" }}
                      >
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          // required={field.required}
                          name={field.label}
                          value={formValues[field.label]}
                          onChange={handleChange}
                          className="form-control"
                        />

                        {index >= 4 && (
                          <>
                            <button
                              type="button"
                              className=" btn-sm m-1"
                              style={{ background: "#F86F03", color: "white" }}
                              onClick={() => handleEdit(index)}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              type="button"
                              className=" btn-sm m-1"
                              style={{ background: "#F86F03", color: "white" }}
                              onClick={() => handleRemove(index)}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="btn submit-btn" style={{marginLeft:"30%"}}>
                    Submit Form
                  </button>
                </form>
              ) : (
                <p>
                  No fields available. Add fields to start building the form.
                </p>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-4" style={{ height: "90vh" }}>
            <div
              // className="shadow p-3 border rounded"
              style={{
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                // border: "#F86F03 2px solid",
              }}
            >
              <h4 style={{ margin: "0.5rem 0rem 1rem 0.2rem" }}>Form Field</h4>
              <form
                onSubmit={handleAddField}
                className="mb-4"
                style={{ padding: "5px" }}
              >
                <div
                  className="mb-3"
                  style={{ width: "100%", marginBottom: "1.5rem" }}
                >
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
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
                    className="form-control"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div
                  className="mb-3"
                  style={{ width: "100%", marginBottom: "1.5rem" }}
                >
                  <label className="form-label">Placeholder</label>
                  <input
                    type="text"
                    className="form-control"
                    name="placeholder"
                    value={formData.placeholder}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  className="mb-3"
                  style={{ width: "100%", marginBottom: "1.5rem" }}
                >
                  <label className="form-label">Required</label>
                  <select
                    className="form-select"
                    name="required"
                    value={formData.required}
                    onChange={handleInputChange}
                  >
                    <option value={null}>Select an Option</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <button type="submit" className="btn Add_update_btn " style={{marginLeft:"30%"}}>
                  {editIndex !== null ? "Update" : "Add Field"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
