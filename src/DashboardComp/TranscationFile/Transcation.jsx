import React, { useState } from "react";
import "./transcation.css";

const Payment = () => {
  const [activeForm, setActiveForm] = useState("payment"); // State to track the active form

  // Function to handle button clicks and set the active form
  const handleButtonClick = (form) => {
    setActiveForm(form);
  };

  return (
    <div>
      <h3>Transaction</h3>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <button
          style={{ marginRight: "30px", background: "none", color: "black" }}
          onClick={() => handleButtonClick("payment")}
        >
          Payment
        </button>
        <button
          style={{ marginRight: "30px", background: "none", color: "black" }}
          onClick={() => handleButtonClick("refunds")}
        >
          Refunds
        </button>
        <button
          style={{ marginRight: "30px", background: "none", color: "black" }}
          onClick={() => handleButtonClick("adjustments")}
        >
          Adjustments
        </button>
      </div>

      {/* Conditionally render forms based on activeForm */}
      {activeForm === "payment" && (
        <div>
          <h5>Data Information Summary</h5>
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th scope="col">Content</th>
                <th scope="col">Data 2</th>
                <th scope="col">Data 3</th>
                <th scope="col">Data 3</th>
                <th scope="col">Data 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Data 1">CONTENT 1</td>
                <td data-label="Data 2">Content 2</td>
                <td data-label="Data 3">Content 3</td>
                <td data-label="Data 3">Content 4</td>
                <td data-label="Data 4">Content 5</td>
              </tr>
              <tr>
                <td data-label="Data 1">CONTENT 2</td>
                <td data-label="Data 2">Content 2</td>
                <td data-label="Data 3">Content 3</td>
                <td data-label="Data 3">Content 4</td>
                <td data-label="Data 4">Content 5</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeForm === "refunds" && (
        <form>
          <p>This is a Refund page</p>
        </form>
      )}
      {activeForm === "adjustments" && (
        <form>
          <p>This is an Adjustment page</p>
        </form>
      )}
    </div>
  );
};

export default Payment;
