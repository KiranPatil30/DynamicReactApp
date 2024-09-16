import React, { useState, useEffect } from "react";
import axios from "axios";
import { getDataApi } from "../API Folder/ApiFile";
import "./DynamicFormPage.css";
import { uploadFile } from "../API Folder/ApiFile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


const DynamicFormPage = () => {
  const [jsonData, setJsonData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(""); // Error message state
  const [eventTitle, setEventTitle] = useState("");
  const [banner, setBanner] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [packages, setPackages] = useState([]);
  const [, setSelectedPackage] = useState("");
  const [packageRate, setPackageRate] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [NewEventId, setsEventIdNew] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggle menu


  useEffect(() => {
    // Extract the last part of the URL path
    const path = window.location.pathname;
    const pathParts = path.split('/');
    const extractedEventId = pathParts[pathParts.length - 1];
    setsEventIdNew(extractedEventId);
    if (!extractedEventId) {
      console.error("sEventId not found in the URL");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://mysoftway.com/eventreg/webservice.php?action=getEventByEventId",
          { sEventId: NewEventId },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("ByEventId", response.data.records)
        let fetchedData = response.data.records[0].sRegistrationLink;
        console.log('fectched data', fetchedData)
        try {
          fetchedData = JSON.parse(fetchedData);
          console.log('second time', fetchedData)
          setJsonData(fetchedData);
        } catch (error) {
          setJsonData([]);
        }

        setFormValues(
          fetchedData.reduce((acc, field) => {
            acc[field.label] = "";
            return acc;
          }, {})
        );


      } catch (error) {
        console.error("Error:", error);

      }
    };

    const fetchEventDetails = async () => {
      try {
        const response = await getDataApi();
        console.log("API Response:", response);

        const eventsArray = Array.isArray(response)
          ? response
          : response.records;

        const event = eventsArray.find(
          (event) => event.sEventId === NewEventId
        );
        console.log("Event", event);
        if (event) {
          setEventTitle(event.sEventTitle);
          setBanner(event.sBanner);
          setThumbnail(event.sThumbnail);
          setPackages(event.sPackages ? JSON.parse(event.sPackages) : []);
          setDescription(event.sDiscription);
          setAttachmentUrl(event.sAttachment);
          console.log("Event package", event.sPackages);
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
    fetchData();
    console.log("Event ID:", NewEventId);
  }, [NewEventId]);

  // Validation functions
  const isValidMobileNumber = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const isValidWhatsAppNumber = (number) => {
    const regex = /^[6-9]\d{9}$/; // Similar to mobile number validation
    return regex.test(number);
  };

  const isValidPincode = (pincode) => {
    const regex = /^\d{6}$/; // 6-digit PIN code
    return regex.test(pincode);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };



  const handleChange = async (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        try {
          const fileUrl = await uploadFile(file); // Upload the file and get the URL
          console.log("fileUrl", fileUrl);
          setFormValues((prevValues) => ({
            ...prevValues,
            [name]: { fileUrl },
          }));
        } catch (error) {
          setError("Failed to upload file. Please try again.");
          console.error("File upload error:", error);
        }
      }
    } else {
      // Handle field validation and value updates
      if (name === "Mobile Number" && !isValidMobileNumber(value)) {
        setError(`Invalid Mobile Number. Please enter a 10-digit number.`);
      } else if (name === "WhatsApp Number" && !isValidWhatsAppNumber(value)) {
        setError(`Invalid WhatsApp Number. Please enter a 10-digit number.`);
      } else if (name === "Pincode" && !isValidPincode(value)) {
        setError(`Invalid Pincode. Please enter a 6-digit number.`);
      } else {
        setError(null); // Clear error if valid
      }

      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate mobile and WhatsApp numbers before submitting
    if (!isValidMobileNumber(formValues["Mobile Number"])) {
      setErrorMsg("Invalid mobile number. Please enter a 10-digit number.");
      return; // Stop form submission
    }

    if (formValues["WhatsApp Number"] && !isValidWhatsAppNumber(formValues["WhatsApp Number"])) {
      setErrorMsg("Invalid WhatsApp number. Please enter a 10-digit number.");
      return; // Stop form submission
    }
    setErrorMsg("");

    // Separate mandatory fields and other fields
    const mandatoryFields = {
      fullName: formValues["Full Name"],
      emailId: formValues["Email"],
      mobileNumber: formValues["Mobile Number"],
      amount: packageRate, // Assuming 'Amount' is a mandatory field linked to packageRate
    };

    // Filter out mandatory fields and include file URLs in the otherDetails array
    const otherDetails = Object.keys(formValues)
      .filter(key => !["Full Name", "Email", "Mobile Number", "Amount"].includes(key))
      .map(key => {
        if (formValues[key] && typeof formValues[key] === 'object' && formValues[key].fileUrl) {
          return { [key]: formValues[key].fileUrl }; // Include only file URLs
        } else {
          return { [key]: formValues[key] || "" }; // Include other form values
        }
      });

    // Combine mandatoryFields and otherDetails into one object
    const consolidatedData = {
      ...mandatoryFields,
      otherDetails: otherDetails,
      sEventId: NewEventId,
    };

    // Log the consolidated data
    console.log("Consolidated Data:", consolidatedData);

    try {
      const response = await axios.post(
        "https://mysoftway.com/eventreg/webservice.php?action=addregister",
        consolidatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.result !== "1") {
        window.alert("There was an error submitting the form. Please try again."); // Display error message
      } else {
        window.alert("Submitted successfully");
      }
      setFormValues(
        jsonData.reduce((acc, field) => {
          acc[field.label] = "";
          return acc;
        }, {})
      );
      setSelectedPackage(""); // Reset selected package
      setPackageRate("");
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');

    } catch (error) {
      console.error("Error:", error);
      window.alert("There was an error submitting the form. Please try again."); // Display error message
    }
  };





  const handlePackageChange = (e) => {
    const selectedTitle = e.target.value;
    setSelectedPackage(selectedTitle);
    const selectedPackage = packages.find((pkg) => pkg.title === selectedTitle);
    setPackageRate(selectedPackage ? selectedPackage.rate : "");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (

    <>

      <header className="header">
        <div className="logo">
          <h3>Logo</h3>
        </div>
        <h1 className="event-title">
          {eventTitle ? eventTitle : "Loading event..."}
        </h1>

        {/* Toggle button for mobile */}
        <div className="toggle-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </div>

        {/* Navigation menu */}
        <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="row shadow border main"  >


        {/* Left side: details */}
        <div className="col-md-6 title_thunmb_desc ">
          {/* Thumbnail, Title, and Description */}
          <div className="row mb-3  event-thumbanil1 " >
            <div className="col-md-4 event-thumbanil2 " >
              {thumbnail && (
                <div className="event-thumbnail-container ">
                  <img
                    src={thumbnail}
                    alt="Event Thumbnail"
                    className="img-fluid event-thumbnail "
                  />
                </div>
              )}
            </div>

            <div className="col-md-8 mt-2 title_thunmb_desc3  ">

              {description && (
                <div className="event-description " >
                  {description}
                </div>
              )}
            </div>
          </div>



          <div className="row mb-3">
            <div className="col-12 ">
              {banner && (
                <div className="event-banner-container ">
                  <img src={banner} alt="Event Banner" className="event-banner" />
                </div>
              )}
            </div>
          </div>








          <div className="row   ">
            <div className="col-12 Available_packages">
              <h4 className="mb-0 mt-3">Available Packages</h4>
              {packages.length > 0 ? (
                <div className="package-list mb-0">
                  {packages
                    .sort((a, b) => b.rate - a.rate) // Sorting packages by rate in descending order
                    .map((pkg, index) => (
                      <span key={index} className="package-item">
                        • {pkg.title} &nbsp; Rs.{pkg.rate}/- &nbsp;&nbsp;&nbsp;
                      </span>
                    ))}
                </div>
              ) : (
                <p className="mb-0">No packages available</p>
              )}
            </div>
          </div>


          <div className="row" >
            {attachmentUrl && (
              <a
                target="_blank"
                href={attachmentUrl}
                download
                className="btn btn-primary btn-lg mt-3 mb-2 animated-button download-link shadow "

              >
                Download Attachment
              </a>
            )}
          </div>





        </div>




        {/* Right side: Form */}
        <div className="col-md-6 mb-4 ">
          <div className="scroll-table-container1 " >
            <form onSubmit={handleSubmit} className="form-container">
              {jsonData.map((field, index) => {
                if (index === 3) {
                  return (
                    <div key={index}>
                      {/* Packages Dropdown */}
                      <div className="form-group mb-3">
                        <label className="form-label">Packages</label>
                        <select


                          required
                          className="form-control selectpackages"
                          onChange={handlePackageChange}
                        >
                          <option value="">Select a Package</option>
                          {packages.map((pkg, idx) => (
                            <option key={idx} value={pkg.title}>
                              {pkg.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Show Package Rate */}
                      <div className="form-group mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          placeholder="Amount"
                          style={{ backgroundColor: "#ffffff" }}
                          type="text"
                          className="form-control Amount"
                          value={`${packageRate}`}
                          readOnly
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className="form-group mb-3">
                    <label
                      htmlFor={`field-${index}`}
                      className="form-label"
                    >
                      {field.label}
                    </label>
                    {field.type === "file" ? (
                      <input
                        style={{ backgroundColor: "off-white" }}

                        type="file"
                        id={`field-${index}`}
                        name={field.label}
                        required={field.required === "1" || field.required === "true"}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <input
                        style={{ backgroundColor: "off-white" }}

                        type={field.type}
                        id={`field-${index}`}
                        name={field.label}
                        placeholder={field.placeholder}
                        value={
                          field.label === "Amount"
                            ? packageRate
                            : formValues[field.label] || ""
                        }
                        onChange={handleChange}
                        className="form-control"
                        required={field.required === "1" || field.required === "true"}
                        readOnly={field.label === "Amount"}
                      />
                    )}
                  </div>
                );
              })}

              <div className="text-danger mt-2">
                {errorMsg && <p>{errorMsg}</p>}
              </div>

              <div className="text-center " style={{ marginTop: '12px' }}>
                <div className="button-container">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg  animated-button"
                    style={{ borderRadius: "10px" }}
                  >
                    Register
                  </button>


                </div>

              </div>
            </form>
          </div>



        </div>

        {/* Right side: Form */}

      </div>

      <footer
        className="text-center mt-4 footer"
        style={{

        }}
      >
        <p className="p">
          &copy; {new Date().getFullYear()} MySoftWay Technology & IT Consultancy. All Rights Reserved.
        </p>
        <p className="p" > <FontAwesomeIcon icon={faEnvelope} />  mysoftway.datalab@gmail.com</p>
      </footer>

      
    </>



  );

};
export default DynamicFormPage;



