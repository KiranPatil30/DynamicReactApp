import React, { useEffect, useState, useRef } from "react";
import UserForm from "./UserFormFile/UserForm";
import UserTable from "./UserTableFile/UserTable";
import "./Payment.css";

const PaymentLink = () => {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleAdd = () => {
    setRefresh((prev) => !prev); // Toggle refresh
    handleCloseForm(); // Close the form
  };

  return (
    <div className="container-fluid pay-container">
      <h1>Event List</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-control mr-3"
            style={{ width: "50%" }}
          />
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search..."
              type="search"
              className="input_search form-control"
              onChange={(e) => setSearch(e.target.value)}
              style={{width:'100%'}}
            />
          </div>
        </div>
        <button className="btn addevent_btn" onClick={() => setShowForm(true)}>
          <i className="fa-solid fa-plus"></i> Add Event
        </button>
      </div>
      {/* <div>
        <div className="d-flex row mb-4 three_btn" >
          <div className="col-md-4 d-flex align-items-center justify-content-start border-red" >
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="form-control"
              style={{ width: "50%" }}
            />
          </div>

          <div className="col-md-4 d-flex align-items-center justify-content-center border-red">
            <div className="group">
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input
                placeholder="Search ..."
                type="search"
                className="input_search form-control"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 d-flex align-items-end justify-content-end border-red">
            <button
              className="btn addevent_btn"
              onClick={() => setShowForm(true)}
            >
              <i className="fa-solid fa-plus"></i> Add Event
            </button>
          </div>

        </div>
      </div> */}
      {/* event list table  */}
      <div>
        <UserTable
          refresh={refresh}
          date={selectedDate}
          search={search}
          filterDate={filterDate}
        />
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="modal show overlay"
          tabIndex="-1"
          style={{ maxHeight: "100%" }}
        >
          <div className="modal-dialog " style={{ maxWidth: "50%" }}>
            <div
              className="modal-content"
              style={{ maxHeight: "20%"}}
            >
              <div className="modal-header" style={{ height: "56px" }}>
                <h5 className="modal-title">Create New Event</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowForm(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ padding: " 15px 0px" }}>
                <UserForm onAdd={handleAdd} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentLink;
