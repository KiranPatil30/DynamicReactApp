import React from "react";
import "../UserFormFile/UserForm.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  uploadEventAttachment,
  uploadEventBanner,
  uploadThumbnail,
} from "../../API Folder/ApiFile";

const API_URL = "https://mysoftway.com/eventreg/webservice.php";

const UpdateUserForm = ({ eventID, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    sBanner: "",
    sThumbnail: "",
    sEventTitle: "",
    sDiscription: "",
    sAttachment: "",
    sEventId: "",
    sPackages: "",
    sToDate: "",
    sFromDate: "",
    sRegistrationLink: "",
  });

  const eventIDToFind = eventID;
  const [packagesArray, setPackagesArray] = useState([]);
  const [packagesData, setPackagesData] = useState({
    PackageTitle: "",
    PackageRate: "",
  });
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

  // Fetch event data when eventId changes
  useEffect(() => {
    if (eventID) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`${API_URL}?action=getEvent`);
          if (response.data.records && response.data.records.length > 0) {
            const event = response.data.records.find(
              (record) => record.sEventId === eventIDToFind
            );
            if (event)
              setFormData({
                sBanner: event.sBanner || "",
                sThumbnail: event.sThumbnail || "",
                sEventTitle: event.sEventTitle || "",
                sDiscription: event.sDiscription || "",
                sAttachment: event.sAttachment || "",
                sEventId: event.sEventId || "",
                sPackages: event.sPackages || "",
                sToDate: event.sToDate || "",
                sFromDate: event.sFromDate || "",
                sRegistrationLink: event.sRegistrationLink || "",
              });
            setPackagesArray(JSON.parse(event.sPackages || "[]"));

            console.log("Found Event:", eventIDToFind);
            // Display the event data
            console.log(`Event ID: ${event.iId}`);
            console.log(`Banner: ${event.sBanner}`);
          } else {
            console.error("No event found with ID:", eventID); // Handle case where no event is found
          }
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEvent();
    }
  }, [eventID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "sPackages") {
      try {
        setPackagesArray(JSON.parse(value));
      } catch (e) {
        console.error("Invalid JSON format in sPackages", e);
      }
    }
  };
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      try {
        let fileUrl;
        switch (name) {
          case "sThumbnail":
            fileUrl = await uploadThumbnail(files[0]);
            setFormData((prevData) => ({ ...prevData, sThumbnail: fileUrl }));
            break;
          case "sAttachment":
            fileUrl = await uploadEventAttachment(files[0]);
            setFormData((prevData) => ({ ...prevData, sAttachment: fileUrl }));
            break;
          case "sBanner":
            fileUrl = await uploadEventBanner(files[0]);
            setFormData((prevData) => ({ ...prevData, sBanner: fileUrl }));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error uploading ${name}:`, error);
      }
    }
  };

  const handleDeletePackage = (index) => {
    const updatedArray = packagesArray.filter((_, i) => i !== index);
    setPackagesArray(updatedArray);
    // Update the formData field
    setFormData((prevData) => ({
      ...prevData,
      sPackages: JSON.stringify(updatedArray),
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    var json = {
      ...formData,
      sEventID: eventID,
    };
    try {
      const response = await axios.post(
        ` ${API_URL}?action=updateEvent`,
        json,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update api ", response);
      if (response.data.result === "2") {
        console.log("Event updated successfully");
        if (onUpdate) onUpdate(); // Call the onUpdate callback
        onClose(); // Close the form on success
      } else {
        console.log("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div>
      <div
        className="ss"
        style={{ overflowY: "scroll", scrollbarWidth: "thin", height: "auto" }}
      >
        <form onSubmit={handleSubmit} className="mb-5 user-form formS">
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
                className="form-control"
                name="sThumbnail"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              {formData.sThumbnail && (
                <p style={{ color: "black" }}>
                  {formData.sThumbnail.split("/").pop()}
                </p>
              )}
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
              <label htmlFor="eventAttachment">
                Event Attachment (PDF or Image)
              </label>
              <input
                type="file"
                id="eventAttachment"
                name="sAttachment"
                className="form-control"
                accept=".pdf,image/*"
                required
                onChange={handleFileChange}
              />
              {formData.sAttachment && (
                <p style={{ color: "black" }}>
                  {formData.sAttachment.split("/").pop()}
                </p>
              )}
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
              {formData.sBanner && (
                <p style={{ color: "black" }}>
                  {formData.sBanner.split("/").pop()}
                </p>
              )}
            </div>
            <div className="input_box">
              {/* <label htmlFor="packages">Packages (JSON)</label> */}
              <input
                type="hidden"
                id="packages"
                name="sPackages"
                placeholder="Enter packages in JSON format"
                required
                value={formData.sPackages}
                onChange={handleInputChange}
              />
            </div>

            <div className="input_box">
              {/* <label htmlFor="registrationLink">Registration Link</label> */}
              <input
                type="hidden"
                id="registrationLink"
                name="sRegistrationLink"
                placeholder="Enter registration link in JSON format"
                required
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
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserForm;
