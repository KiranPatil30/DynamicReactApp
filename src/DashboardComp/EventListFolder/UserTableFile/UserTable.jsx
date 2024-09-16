import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateUserForm from "../UserUpdateFile/UpdateUserForm";
// import { getDataApi } from "./ApiFile";
import { NavLink } from "react-router-dom";
import DynamicForm from "../../DynamicFormFolder/DynamicForm";
import "../UserTableFile/usertable.css";

const UserTable = ({ refresh, filterDate, search }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm1, setShowForm1] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [packagesArray, setPackagesArray] = useState([]);
  const [tempPackages, setTempPackages] = useState([]); // Temporary packages
  const [newPackage, setNewPackage] = useState("");
  const [showUpdateForm, setShowUpadateForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [packagesData, setPackagesData] = useState({
    PackageTitle: "",
    PackageRate: "",
  });
  const [formData, setFormData] = useState({
    sPackages: "",
  });
  const API_URL = "https://mysoftway.com/eventreg/webservice.php";

  const getData = async () => {
    try {
      const response = await axios.get(`${API_URL}?action=getEvent`);
      // const response = await getDataApi();

      if (response.status < 200 || response.status >= 300) {
        console.log("Network response was not ok");
        setLoading(false);
        return;
      }
      setEvents(response.data.records);
      setLoading(false);
    } catch (err) {
      console.log("error", err);
      setError(err);
      setLoading(false);
    }
  };

  // edit packages fetchevent

  useEffect(() => {
    if (currentEventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`${API_URL}?action=getEvent`);
          if (response.data.records && response.data.records.length > 0) {
            const event = response.data.records.find(
              (record) => record.sEventId === currentEventId
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
          } else {
            console.error("No event found with ID:", currentEventId); // Handle case where no event is found
          }
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEvent();
    }
    getData();
  }, [refresh, currentEventId]);

  const handleDelete = async (eventId) => {
    try {
      const response = await axios.post(`${API_URL}?action=deleteEvent`, {
        sEventId: eventId,
      });
      if (response.status < 200 || response.status >= 300) {
        console.log("Network response was not ok");
        return;
      }
      setEvents(events.filter((event) => event.sEventId !== eventId));
    } catch (err) {
      console.log("Error deleting event", err);
    }
  };

  const handleUpdate = (eventId) => {
    setCurrentEventId(eventId);
    setShowForm1(true);
  };

  const handleCloseForm = () => {
    setShowForm1(false);
    setCurrentEventId(null);
  };

  const handleUpdateData = () => {
    getData(); // Re-fetch data after update
  };

  const handleInputChange = (e) => {
    setNewPackage(e.target.value);
  };
  const handleAddPackage = () => {
    if (newPackage.trim()) {
      setTempPackages([...tempPackages, newPackage.trim()]);
      setNewPackage(""); // Clear the input
    }
  };
  const editPackage = (eventId) => {
    setCurrentEventId(eventId);
    setShowForm(true);
  };
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

  const handleDeletePackage = (index) => {
    const updatedArray = packagesArray.filter((_, i) => i !== index);
    setPackagesArray(updatedArray);
    // Update the formData field
    setFormData((prevData) => ({
      ...prevData,
      sPackages: JSON.stringify(updatedArray),
    }));
  };

  // end form format view code
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit");
    var json = {
      ...formData,
      sEventID: currentEventId,
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
        // if (onUpdate) onUpdate(); // Call the onUpdate callback
        // onClose(); // Close the form on success
        getData();
        setShowForm(false);
      } else {
        console.log("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const copyUrlToClipboard = (eventId) => {
    const previewFormUrl = `${window.location.origin}/userpage/${eventId}`;
    navigator.clipboard
      .writeText(previewFormUrl)
      .then(() => {
        alert("Preview Form URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // show Update form as Pop Type
  const handleCloseUpadateForm = () => {
    setShowUpadateForm(false);
  };
  const handleShowUpdateForm = (eventid) => {
    setSelectedEventId(eventid);
    setShowUpadateForm(true);
  };
  return (
    <div>
      {/* <input type="text " placeholder="search..." onChange={(e)=>setSearch(e.target.value)} /> */}
      <div className="table-container table_conte">
        {loading ? (
          <div className="loader">
            <div className="justify-content-center jimu-primary-loading"></div>
          </div>
        ) : error ? (
          <p>Error loading events: {error.message}</p>
        ) : (
          <div className="">
            <table
              className="table table-hover table-bordered"
              style={{ maxWidth: "100%" }}
            >
              <thead className="thead-dark" style={{ position: "sticky" }}>
                <tr style={{ marginBottom: "20px" }}>
                  <th
                    scope="col"
                    className="text-center"
                    style={{ width: "6%" }}
                  >
                    Sr no.
                  </th>
                  <th
                    scope="col"
                    className="text-center"
                    style={{ width: "50px" }}
                  >
                    Thumbnail
                  </th>
                  <th scope="col" className="text-center" style={{ width: "" }}>
                    Title
                  </th>
                  <th scope="col" className="text-center" style={{ width: "10%" }}>
                    From Date
                  </th>
                  <th scope="col" className="text-center" style={{ width: "10%" }}>
                    To Date
                  </th>
                  <th scope="col" className="text-center" style={{ width: "" }}>
                    Packages
                  </th>
                  <th
                    scope="col"
                    className="text-center"
                    style={{ width: "15%" }}
                  >
                    Form Format
                  </th>
                  <th className="text-center" style={{ width: "12%" }}>
                    Register User
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Link
                  </th>
                  <th
                    scope="col"
                    className="text-center"
                    style={{ width: "20px" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {events &&
                  events
                    .filter((item) => {
                      // return search.toLowerCase() === ""
                      //   ? item
                      //   : item.sEventTitle.toLowerCase().includes(search);
                      const fromDate = new Date(item.sFromDate);
                      const toDate = new Date(item.sToDate);
                      const filterDateObj = new Date(filterDate);

                      // Filter by search term
                      const matchesSearch =
                        search.toLowerCase() === "" ||
                        item.sEventTitle.toLowerCase().includes(search);

                      // Check if filterDate is within the range of fromDate and toDate
                      const matchesDateRange =
                        filterDate === "" ||
                        (filterDateObj >= fromDate && filterDateObj <= toDate);

                      return matchesSearch && matchesDateRange;
                    })
                    .map((event, index) => {
                      // Parse packages JSON
                      let packagesList = [];
                      try {
                        packagesList = JSON.parse(event.sPackages);
                      } catch (e) {
                        console.log("Error parsing sPackages", e);
                        packagesList = [];
                      }

                      return (
                        <tr
                          key={event.iId}
                          // onMouseEnter={() => setHoveredRow(index)}
                          // onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td scope="row" className="text-center">
                            {index + 1}
                          </td>
                          <td scope="row" className="text-center">
                            {event.sThumbnail && (
                              <img
                                src={event.sThumbnail}
                                alt="Thumbnail"
                                style={{ width: "85px", height: "45px" }}
                              />
                            )}
                          </td>
                          <td scope="row" className="text-center">
                            {event.sEventTitle}
                          </td>

                          <td scope="row" className="text-center">
                            {formatDate(event.sFromDate)}
                          </td>
                          <td scope="row" className="text-center">
                            {formatDate(event.sToDate)}
                          </td>
                          <td
                            scope="row"
                            className="text-center"
                            style={{ width: "16%" }}
                          >
                            <button
                              className="rounded hover-button"
                              style={{
                                background: "none",
                                color: "black",
                                // fontWeight: "600",
                                padding: "0px 0px",
                              }}
                              onClick={() => editPackage(event.sEventId)}
                            >
                              view
                            </button>
                          </td>
                          <td
                            scope="row"
                            className="text-center"
                            style={{ width: "15%" }}
                          >
                            <button
                              className=""
                              style={{
                                background: "none",
                                color: "black",
                                padding: "0px 0px",
                              }}
                              onClick={() =>
                                handleShowUpdateForm(event.sEventId)
                              }
                            >
                              Update Form
                            </button>
                          </td>
                          <td className="text-center">
                            <NavLink
                              to={`/Home/viewregistration/${event.sEventId}`}
                              className="nav-link1"
                              style={{
                                background: "none",
                                color: "black",
                                textDecoration: "none",
                              }}
                            >
                              View
                            </NavLink>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => copyUrlToClipboard(event.sEventId)}
                              style={{
                                background: "none",
                                color: "black",
                                // fontWeight: "600",
                                fontSize: "14px",
                                padding: "0px 0px",
                              }}
                            >
                              <i
                                className="fas fa-link"
                                style={{ paddingRight: "5px" }}
                              ></i>
                              Copy URL
                            </button>
                          </td>
                          <td
                            scope="row"
                            className="text-center"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "6px",
                              padding: "0px 0px",
                            }}
                          >
                            <button
                              className="btn-updat bt"
                              onClick={() => handleUpdate(event.sEventId)}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className=""
                              onClick={() => handleDelete(event.sEventId)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                background: "none",
                                color: "black",
                              }}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                            {event.sAttachment && (
                              <a
                                href={`${event.sAttachment}`}
                                className="btn-link bt"
                              >
                                <i
                                  className="fa fa-download"
                                  aria-hidden="true"
                                  style={{ color: "black" }}
                                ></i>
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}
        {showForm1 && (
          <div className="modal show d-block overlay" tabIndex="-1">
            <div
              className="modal-dialog"
              style={{
                maxWidth: "50%",
                // border: "black 2px solid",
                borderRadius: "10px",
              }}
            >
              <div className="modal-content">
                <div className="modal-header" style={{ height: "55px" }}>
                  <h5 className="modal-title">Update Event</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowForm1(false)}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ padding: "10px 0px" }}>
                  <UpdateUserForm
                    eventID={currentEventId}
                    onClose={handleCloseForm}
                    onUpdate={handleUpdateData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showForm && (
          <div
            className="modal show overlay"
            tabIndex="-1"
            style={{ maxHeight: "100%", position: "fixed" }}
          >
            <div className="modal-dialog" style={{ maxWidth: "40%" }}>
              <div
                className="modal-content"
                style={{ maxHeight: "100%" }}
              >
                <div className="modal-header" style={{ maxHeight: "55px" }}>
                  <h5 className="modal-title">Edit Packages</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowForm(false)}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="input_box">
                    <label htmlFor="packages">Packages</label>
                    <div className="row d-flex justify-content-between">
                      <div
                        className="col-12 col-sm-6 col-md-4 mb-3"
                        style={{ width: "40%" }}
                      >
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
                      <div
                        className="col-12 col-sm-6 col-md-4 mb-3"
                        style={{ width: "40%" }}
                      >
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
                      <div
                        className="col-12 col-md-4 mb-3 d-flex justify-content-end"
                        style={{ width: "20%" }}
                      >
                        <div
                          className="reg_btn"
                          style={{ padding: "0px", margin: "8px 0" }}
                        >
                          <button
                            className=""
                            type="submit"
                            onClick={handlePackagesSubmit}
                            style={{
                              background: "#F86F03",
                              borderRadius: "4px",
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="package-list d-flex">
                      <h5>Added Packages:</h5>
                      <table className="table table-striped">
                        <thead>
                          <tr className="text-center">
                            <th>Title</th>
                            <th>Rate</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {packagesArray.map((pkg, index) => (
                            <tr key={index}>
                              <td className="text-center">{pkg.title}</td>
                              <td className="" style={{ paddingLeft: "12%" }}>
                                Rs. {pkg.rate}
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn-sm"
                                  style={{
                                    background: "#F86F03",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() => handleDeletePackage(index)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="reg_btn">
                    <button
                      className="add_event"
                      type="submit"
                      value=" Add Event "
                      onClick={handleSubmit}
                      style={{ background: "#F86F03", borderRadius: "4px" }}
                    >
                      Update Packages
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showUpdateForm && (
          <div
            className="modal show d-block main_mode overlay"
            id="updateFormModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="updateFormModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-lg custom-modal-dialog"
              role="document"            >
              <div className="modal-content custom-modal-content  ">
                  <button
                    type="button"
                    className="close custom-close-button"
                    onClick={handleCloseUpadateForm}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                <div
                  className="modal-body  custom-modal-body"
                >
                  <DynamicForm eventIdU={selectedEventId} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
