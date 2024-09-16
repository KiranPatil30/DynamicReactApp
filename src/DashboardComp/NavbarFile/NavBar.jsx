import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(true);

  const handleLogout = () => {
    sessionStorage.clear();
    setShouldNavigate(false);
    localStorage.removeItem("isAuthenticated");
  };

  useEffect(() => {
    if (!shouldNavigate) {
      navigate("/", { replace: true });
    }
  }, [shouldNavigate, navigate]);
  return (
    <div className="navbar-custom d-flex flex-column p-3 border-end bg-light">
      <div>
        <img
          src={
            "https://qubatechnologies.com/wp-content/uploads/2021/11/Logo-Design-All-Types-Of-Logo-Design.png"
          }
          className="img-responsive mb-4"
          width="215px"
          height="120"
          alt="Logo"
        />

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-1">
            <NavLink className="nav-link" to="/Home/Home1">
              <i className="fa-solid fa-house icon-padding"></i>
              Home
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink className="nav-link" to={"/Home/trans"}>
              <i className="fa-regular fa-credit-card icon-padding"></i>{" "}
              Transaction
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink className="nav-link" to={"/Home/payment"}>
              <i className="fa-solid fa-list icon-padding"></i>
              Event List
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink className="nav-link" to={"/Home/report"}>
              <i className="fa-regular fa-credit-card icon-padding"></i>
              Report
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink className="nav-link" to={"/Home/settlements"}>
              <i className="fa-regular fa-credit-card icon-padding"></i>
              Settlements
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink className="nav-link" to={"/Home/mystore"}>
              <i className="fa-regular fa-credit-card icon-padding"></i>
              My Stores
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-auto lgod">
        <button className="btn btn-logout lgo" onClick={handleLogout}>
          <i className="fa-solid fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
