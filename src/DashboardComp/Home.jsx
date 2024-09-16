// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import NavBar from "./NavbarFile/NavBar";
// import { useState,useEffect } from "react";
// // import "./Home1File/home.css";
// import "./HomeNav.css";

// const Home = () => {
//   const [isNavVisible, setIsNavVisible] = useState(true); // Start with nav hidden for mobile

//   // Toggle button click handler
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setIsNavVisible(false); // Hide navbar on smaller screens
//       } else {
//         setIsNavVisible(true); // Show navbar on larger screens
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // Set the initial state based on screen size

//     // Clean up the event listener on component unmount
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   const toggleNav = () => {
//     setIsNavVisible((prev) => !prev); // Toggle visibility state
//   };
//   return (
//     // <div style={{ display: "flex" }}>
//     //   <div
//     //     style={{
//     //       position: "fixed",
//     //       left: "16%",
//     //       maxWidth: "100%",
//     //       maxHeight: "100%",
//     //     }}
//     //   >
//     //     <div style={{ }}>
//     //       <NavBar />
//     //     </div>
//     //     <Outlet />
//     //   </div>
//     // </div>
//     <div className="home-container" style={{ display: "flex" }}>
//     {/* Navigation bar container with visibility control */}
//     <div className={`navbar-container ${isNavVisible ? "visible" : "hidden"}`}>
//       <NavBar />
//     </div>

//     {/* Main content container */}
//     <div className="content-container" style={{marginLeft:'15%'}}>
//       {/* Toggle button for mobile view */}
//       <button className="toggle-button" onClick={toggleNav}>
//         ☰
//       </button>
//       <Outlet />
//     </div>
//   </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavbarFile/NavBar";
import "./HomeNav.css";

const Home = () => {
  const [isNavVisible, setIsNavVisible] = useState(true); // Initially visible on larger screens

  // Effect to hide/show navbar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavVisible(false); // Hide navbar on smaller screens
      } else {
        setIsNavVisible(true); // Show navbar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state based on screen size

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle button click handler
  const toggleNav = () => {
    setIsNavVisible((prev) => !prev); // Toggle visibility state
  };

  return (
    <div className="home-container" style={{ display: "flex" }}>
      {/* Navigation bar container with visibility control */}
      <div className={`navbar-container ${isNavVisible ? "visible" : "hidden"}`}>
        <NavBar />
      </div>

      {/* Main content container */}
      <div className="content-container">
        {/* Toggle button for mobile view */}
        <button className="toggle-button" onClick={toggleNav}>
          ☰
        </button>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;

