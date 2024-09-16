import React, { useState } from "react";
import "./UserForm.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  uploadEventAttachment,
  uploadEventBanner,
  uploadThumbnail,
} from "../../API Folder/ApiFile";
const API_URL = "https://mysoftway.com/eventreg/webservice.php";

const UserForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    sEventTitle: "",
    sThumbnail: null,
    sDiscription: "",
    sAttachment: null,
    sFromDate: "",
    sToDate: "",
    sBanner: null,
    sPackages: "",
    sRegistrationLink: "",
    sEventId: uuidv4(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [packagesData, setPackagesData] = useState({
    PackageTitle: "",
    PackageRate: "",
  });
  const [packagesArray, setPackagesArray] = useState([]);

  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setPackagesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePackagesSubmit = (e) => {
    e.preventDefault();

    // Add the new package to the array
    setPackagesArray((prevArray) => [
      ...prevArray,
      {
        title: packagesData.PackageTitle,
        rate: packagesData.PackageRate,
      },
    ]);

    // Clear the input fields
    setPackagesData({
      PackageTitle: "",
      PackageRate: "",
    });
  };

  const jsonPackages = JSON.stringify(packagesArray);
  formData.sPackages = jsonPackages;

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      try {
        let fileUrl;
        switch (name) {
          case "sThumbnail":
            fileUrl = await uploadThumbnail(files[0]);
            console.log("URL", fileUrl);

            formData.sThumbnail = fileUrl;
            console.log(formData.sThumbnail);
            // console.log(`${name} selected file :` , files[0]);

            break;
          case "sAttachment":
            fileUrl = await uploadEventAttachment(files[0]);
            console.log("Attachment", formData.sThumbnail);

            formData.sAttachment = fileUrl;

            console.log(formData.sAttachment);

            // console.log(`${name} selected file :` , files[0]);

            break;
          case "sBanner":
            fileUrl = await uploadEventBanner(files[0]);
            console.log(fileUrl);
            // console.log(`${name} selected file :` , files[0]);
            formData.sBanner = fileUrl;
            console.log(formData.sBanner);

            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error uploading ${name}:`, error);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    var json = {
      sEventTitle: formData.sEventTitle,
      sThumbnail: formData.sThumbnail,
      sDiscription: formData.sDiscription,
      sAttachment: formData.sAttachment,
      sFromDate: formData.sFromDate,
      sToDate: formData.sToDate,
      sBanner: formData.sBanner,
      sPackages: formData.sPackages,
      sRegistrationLink: formData.sRegistrationLink,
      // sEventId: uuidv4(),
    };
    try {
      const response = await axios.post(`${API_URL}?action=addEvent`, json, {
        headers: {
          "Content-Type": "JSON",
        },
      });
      console.log("Response from API:", response);
      console.log("rrrrrrrrr", response.data.result);
      if (response.data.result == 1) {
        alert("Event created successfully!");

        onAdd();

        setFormData({
          sEventTitle: "",
          sThumbnail: null,
          sDiscription: "",
          sAttachment: null,
          sFromDate: "",
          sToDate: "",
          sBanner: null,
          sPackages: "",
          sRegistrationLink: "",
          sEventId: uuidv4(),
        });
      } else {
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  return (
    <div
      className="ss"
      style={{ overflowY: "scroll", height: "40em",scrollbarWidth:"thin", maxWidth: "100%" }}
    >
      <form
        onSubmit={handleSubmit}
        className="user-form formS"
        style={{ maxWidth: "100%" }}
      >
        <div className="user_details">
          <div className="input_box">
            <label htmlFor="eventTitle">Event Title</label>
            <input
              type="text"
              id="eventTitle"
              name="sEventTitle"
              placeholder="Enter event title"
              required
              value={formData.sEventTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="thumbnail">Thumbnail </label>
            <input
              type="file"
              id="thumbnail"
              name="sThumbnail"
              className="form-control"
              accept="image/*"
              required
              onChange={handleFileChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="eventDescription">Event Description</label>
            <textarea
              id="eventDescription"
              name="sDiscription"
              placeholder="Enter event description (100-1000 words)"
              required
              minLength={10}
              maxLength={1000}
              value={formData.sDiscription}
              onChange={handleInputChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="eventAttachment">Event Attachment (PDF)</label>
            <input
              type="file"
              id="eventAttachment"
              name="sAttachment"
              className="form-control"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="eventDatesFrom">Event Dates (From)</label>
            <input
              type="date"
              id="eventDatesFrom"
              name="sFromDate"
              required
              value={formData.sFromDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="eventDatesTo">Event Dates (To)</label>
            <input
              type="date"
              id="eventDatesTo"
              name="sToDate"
              required
              value={formData.sToDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="eventBanner">Event Banner</label>
            <input
              type="file"
              id="eventBanner"
              name="sBanner"
              className="form-control"
              accept="image/*"
              required
              onChange={handleFileChange}
            />
          </div>
          <div className="input_box">
            <label htmlFor="packages">Packages</label>
            <div className="row" style={{}}>
              <div className="col-md-4 col-sm-12">
                <input
                  type="text"
                  id="PackageTitle"
                  name="PackageTitle"
                  placeholder="Title"
                  required
                  value={packagesData.PackageTitle}
                  onChange={handlePackageInputChange}
                />
              </div>
              <div className="col-md-4 col-sm-12">
                <input
                  type="number"
                  id="PackageRate"
                  name="PackageRate"
                  placeholder="Rate"
                  required
                  value={packagesData.PackageRate}
                  onChange={handlePackageInputChange}
                />
              </div>
              <div className="col-md-4 col-sm-12">
                <div
                  className="reg_btn"
                  style={{ margin: "-7px", paddingLeft: "30%" }}
                >
                  <button
                    className="add_event"
                    type="submit"
                    onClick={handlePackagesSubmit}
                    style={{ margin: "14px 35px" }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Display list of packages */}
            <div className="package-list d-flex">
              <h5>Added Packages:</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="text-center">Title</th>
                    <th className="text-center">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {packagesArray.map((pkg, index) => (
                    <tr key={index}>
                      <td className="text-center">{pkg.title}</td>
                      <td className="text-center">Rs {pkg.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <input
              type="hidden"
              id="packages"
              name="sPackages"
              value={formData.sPackages} // Set the JSON string as the value
            />
          </div>
          <div className="input_box">
            {/* <label htmlFor="registrationLink">Registration Link</label> */}
            <input
              type="hidden"
              id="registrationLink"
              name="sRegistrationLink"
              placeholder="Enter registration link in JSON format"
              value={formData.sRegistrationLink}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="reg_btn">
          <button
            className="add_event"
            type="submit"
            value=" Add Event "
            onClick={handleSubmit}
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
