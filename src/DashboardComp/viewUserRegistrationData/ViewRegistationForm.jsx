import React, { useEffect, useState } from "react";
import "./viewregister.css";
import { useParams } from "react-router";
import { viewRegistartionUserApi } from "../API Folder/ApiFile";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { getEventIdByTitle } from "../API Folder/ApiFile";
import { useNavigate } from "react-router";

const ViewRegistationForm = () => {
  const navigate = useNavigate();

  const { eventId } = useParams();
  const [data, setData] = useState([]);
  const [otherDetailsKeys, setOtherDetailsKeys] = useState([]);
  const [showTitle, setShowTitle] = useState("");

  const fetchData = async () => {
    try {
      const response = await viewRegistartionUserApi(eventId);
      console.log("data", response.records);
      setData(response.records);

      // Extract dynamic keys from otherDetails
      const allOtherDetails = response.records.map((item) => {
        try {
          const parsedDetails = JSON.parse(item.otherDetails);
          return Array.isArray(parsedDetails) ? parsedDetails : [];
        } catch (e) {
          console.error("Error parsing otherDetails:", e);
          return [];
        }
      });

      const keysSet = new Set();
      allOtherDetails.forEach((details) => {
        if (Array.isArray(details)) {
          details.forEach((detail) => {
            Object.keys(detail).forEach((key) => keysSet.add(key));
          });
        }
      });

      setOtherDetailsKeys(Array.from(keysSet));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTitle = async () => {
    try {
      if (!eventId) {
        console.error("Invalid Event ID:", eventId);
        return;
      }
      const response = await getEventIdByTitle(eventId);
      if (response && response.records && response.records.length > 0) {
        const eventTitle = response.records[0].sEventTitle;
        setShowTitle(eventTitle);
      } else {
        console.error("No records found or response is invalid:", response);
        setShowTitle("Title not found");
      }
    } catch (error) {
      console.error("Error fetching title:", error.message);
    }
  };
  useEffect(() => {
    console.log("Event Id - ", eventId);
    fetchData();
    fetchTitle();
  }, [eventId]);

  const getPaymentStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "#666600",
          background: "#ffff99",
          borderRadius: "25px",
          maxWidth: "63%",
          marginLeft: "35px",
        };
      case "done":
        return {
          borderRadius: "25px",
          width: "100px",
          color: "#18453B",
          background: "#98FB98",
          maxWidth: "63%",
          marginLeft: "35px",
        };
      case "cancelled":
        return { color: "#e60000", background: "#ff4d4d",
          maxWidth: "63%",
          marginLeft: "35px",
         };
      default:
        return { color: "black" };
    }
  };

  const downloadExcel = () => {
    const exportData = data.map((item) => {
      let otherDetails = [];
      try {
        otherDetails = JSON.parse(item.otherDetails);
      } catch (e) {
        console.error("Error parsing otherDetails:", e);
      }
      const otherDetailsMap = {};
      if (Array.isArray(otherDetails)) {
        otherDetails.forEach((detail) => {
          Object.entries(detail).forEach(([key, value]) => {
            otherDetailsMap[key] = value;
          });
        });
      }

      return {
        Name: item.fullName,
        Email: item.emailId,
        "Mobile Number": item.mobileNumber,
        Amount: item.amount,
        "Payment Status": item.sPaymentStatus,
        ...otherDetailsMap,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
    XLSX.writeFile(workbook, "UserData.xlsx");
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="main_div_reg">
      <div className="back-userdata">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="back_btn_user"
        >
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </button>
        <h2 className="title-register">
          {showTitle ? showTitle : "loading title..."}
        </h2>
        <button onClick={downloadExcel} className="excel-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="20px"
            width="24px"
          >
            <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              id="SVGRepo_tracerCarrier"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g id="Interface / Download">
                {" "}
                <path
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="#f1f1f1"
                  d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                  id="Vector"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
          Download as Excel
        </button>
      </div>

      <div className="table-container rgister-table">
        <table
          border="1"
          className="table table-hover table-bordered shadow"
          style={{ maxWidth: "100%",borderRadius:'20px' }}
        >
          <thead className="table-head">
            <tr >
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Mobile Number</th>
              <th className="text-center">Amount</th>
              {otherDetailsKeys.map((key) => (
                <th key={key} className="text-center">
                  {key}
                </th>
              ))}
              <th className="text-center">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                let otherDetails = [];
                try {
                  otherDetails = JSON.parse(item.otherDetails);
                } catch (e) {
                  console.error("Error parsing otherDetails:", e);
                }
                const otherDetailsMap = {};
                if (Array.isArray(otherDetails)) {
                  otherDetails.forEach((detail) => {
                    Object.entries(detail).forEach(([key, value]) => {
                      otherDetailsMap[key] = value;
                    });
                  });
                }

                return (
                  <tr key={index}>
                    <td className="text-center">{item.fullName}</td>
                    <td className="text-center">{item.emailId}</td>
                    <td className="text-center">{item.mobileNumber}</td>
                    <td className="text-center">{item.amount}</td>
                    {otherDetailsKeys.map((key) => (
                      <td key={key} className="text-center">
                        {isValidURL(otherDetailsMap[key]) ? (
                          <button
                            onClick={() =>
                              window.open(otherDetailsMap[key], "_blank")
                            }
                            className="viewfilebtn"
                          >
                            View File
                          </button>
                        ) : typeof otherDetailsMap[key] === "object" ? (
                          JSON.stringify(otherDetailsMap[key])
                        ) : (
                          otherDetailsMap[key] || ""
                        )}
                      </td>
                    ))}
                    <td className="text-center">
                      <div style={getPaymentStatusStyle(item.sPaymentStatus)}>
                        {item.sPaymentStatus}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5 + otherDetailsKeys.length}
                  className="text-center"
                >
                  No Data Available in the Table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRegistationForm;
