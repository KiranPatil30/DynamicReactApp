import React from "react";
import { useState } from "react";
import { ApiService } from "./ApiService";
import Swal from "sweetalert2";

const SignUp = ({ toggleMode }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const validateInputs = () => {
    const isNumeric = /^\d+$/.test(mobile);

    if (
      !name ||
      !city ||
      !email ||
      !password ||
      !mobile ||
      !ifscCode ||
      !accountNo ||
      !bankName
    ) {
      setError("All fields are Mandatory");
      return false;
    }
    if (!email.endsWith("@gmail.com") || !/^[\w-.]+@gmail\.com$/.test(email)) {
      setError("Email must end with @gmail.com and be valid.");
      setShowModal(true);
      return false;
    } else if (city.length === 0) {
      setError("enter your location ");
    }
    // Strong password validation
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password)) {
    setError(
      "Password must be at least 8 character, include uppercase and lowercase letters, a number, and a special character."
    );
    return false;
  
    } else if (!/^[7-9][0-9]{9}$/.test(mobile)) {
      setError(
        "Please enter a valid mobile number starting with 7-9 and 10 digits long."
      );
      setShowModal(true);
      return false;
    } else if (!isNumeric) {
      setError("Please enter only numeric characters for the mobile number.");
      return false;
    }
    // window.alert("Successfull Register !");
    else setError(" ");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    // e.preventDefault();

    const data1 = {
      name,
      city,
      email,
      password,
      mobile,
      ifscCode,
      accountNo,
      bankName,
    };
    console.log("Sign Up Data:", data1);

    const data = {
      sName: name,
      sCity: city,
      sEmail: email,
      sPassword: password,
      sMobileNo: mobile,
      sIFSCCode: ifscCode,
      iAccountNo: accountNo,
      sBankName: bankName,
      iBisactive: "", // assuming this is a default active status
    };

    try {
      const response = await ApiService(data);
      console.log(response.result);
      if (response && response.result == 1) {
        console.log("Registration successful:", response);
        
        Swal.fire({
          title: "Success",
          text: "Registration successful",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Reset form fields
          setName("");
          setCity("");
          setEmail("");
          setPassword("");
          setMobile("");
          setIfscCode("");
          setAccountNo("");
          setBankName("");

          // Call the toggleMode function to switch to the SignIn component
          toggleMode();
        });
      } else {
        // setError("An error occurred during registration.");
        throw new Error("Invalid response format or result.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      // setError("An error occurred during registration11.");
      setError(`An error occurred during registration: ${error.message}`);
    }
  };

  return (
    <form action="#" className="sign-up-form formS" onSubmit={handleSubmit}>
      <h2 className="title">Registration</h2>

      <div className="Input">
        <div className="input-field ">
          <i className="fa-regular fa-user"></i>
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-field">
          <i className="fa-solid fa-location-dot"></i>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
      <div className="Input">
        <div className="input-field">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-field">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="Input">
        <div className="input-field">
          <i className="fas fa-mobile-alt"></i>
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[7-9][0-9]{9}"
            title="Phone number must start with 7-9 and contain 10 digits."
            required
          />
        </div>
        <div className="input-field">
          <i className="fas fa-university"></i>
          <input
            type="text"
            placeholder="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />
        </div>
      </div>

      <div className="Input">
        <div className="input-field">
          <i className="fas fa-money-check-alt"></i>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>
        <div className="input-field">
          <i className="fas fa-building"></i>
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <input
        type="submit"
        className="btn"
        value="Sign up"
        onClick={handleSubmit}
      />

      {/* <IconComp/> */}
    </form>
  );
};

export default SignUp;
