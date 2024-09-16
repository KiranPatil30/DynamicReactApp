import React, { useEffect, useState } from "react";
import { loginUser } from "./ApiService";
import Swal from "sweetalert2";
import "./SignIn.css";
import { useNavigate } from "react-router";
const SignIn = ({ toggleMode }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const isNumeric = /^\d+$/.test(mobile);
    if (password.length <= 4) {
      setError("Password should be greater than 8 characters.");
      return false;
    }
    if (!isNumeric) {
      setError("Please enter only numeric characters for the mobile number.");
      return false;
    }
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    const data = {
      sMobileNo: mobile,
      sPassword: password,
    };
    try {
      const response = await loginUser(data);
      if (response.result == 1) {
        setError("Incorrect password.");
      } else {
        if (response.result == 3) {
          setError("Invalid mobile number.");
        } else {
          if (response.result == 2) {
            localStorage.setItem("isAuthenticated", "true");
            console.log(sessionStorage.getItem("password"));
            Swal.fire({
              title: "Success",
              text: "Login successful",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
            
              navigate("/Home/Home1", { replace: true }); // Replace prevents adding the login page to the history stack
            });
          } else {
            setError("An error occurred during registration.");
          }
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/Home/Home1", { replace: true });
    }
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <form className="sign-in-form formS" onSubmit={handleSubmit}>
      <h2 className="title">Login In </h2>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input
          type="text"
          placeholder="Mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock "></i>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <input type="submit" value="Login" className="btn solid" style={{background:' #F86F03 '}}/>
    </form>
  );
};

export default SignIn;
