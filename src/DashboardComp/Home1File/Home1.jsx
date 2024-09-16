// import React from "react";
// import "./home.css";
// import { getDataApi } from "../API Folder/ApiFile";
// import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// const Home1 = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const getData = async () => {
//     try {
//       const response = await getDataApi(); // Get the data from getDataApi
//       if (response && response.records) {
//         setData(response.records); // Set data to state
//       } else {
//         console.log("No data found");
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching data:", error);
//       setError(err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   const backgroundImageStyle = {
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     height: "100vh",
//   };
//   const formatDate = (dateInput) => {
//     const date = new Date(dateInput);

//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     const month = months[date.getMonth()];
//     const day = date.getDate();
//     const year = date.getFullYear();

//     return `${month} ${day}, ${year}`;
//   };

//   return (
//     <div>
//       {loading ? (
//         <div className="loader">
//           <div className="justify-content-center jimu-primary-loading"></div>
//         </div>
//       ) : error ? (
//         <p>Error loading events: {error.message}</p>
//       ) : (
//         <div style={backgroundImageStyle}>
//           <div className="cards-container">
//             {data.map((item) => (
//               <div className="containerh" key={item.iId}>
//                 <div className="wrapper">
//                   <div className="banner-image">
//                     <img
//                       src={item.sThumbnail}
//                       alt={item.sThumbnail}
//                       style={{ width: "340px", height: "11rem" }}
//                     />
//                   </div>
//                   <h1 className="h_1">{item.sEventTitle}</h1>
//                   <p className="p-p">{item.sDiscription}</p>
//                 </div>
//                 <div className="button-wrapper">
//                   <div className="from-to">
//                     <p>
//                       <strong>From:</strong>
//                       <>{formatDate(item.sFromDate)}</>
//                     </p>
//                     <p>
//                       <strong>To: </strong>
//                       {formatDate(item.sToDate)}
//                     </p>
//                   </div>

//                   <button className="rounded add_btn">
//                     <NavLink
//                       to={`/Home/DynamicForm/${item.sEventId}`}
//                       state={{ from: "AddButton" }} // Pass state to indicate the source
//                       className="nav-link"
//                     >
//                       Add Registration Link
//                     </NavLink>
//                     <Outlet />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home1;


import React from "react";
import "./home.css";
import { getDataApi } from "../API Folder/ApiFile";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import "react-loading-skeleton/dist/skeleton.css"; // Import Skeleton styles

const Home1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await getDataApi(); // Fetch data from API
      if (response && response.records) {
        setData(response.records); // Set data to state
      } else {
        console.log("No data found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const backgroundImageStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };

  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <div>
      {loading ? (
        <div className="cards-container">
          {/* Create skeleton loaders dynamically based on the number of data items */}
          {Array.from({ length: data.length || 3 }).map((_, index) => (
            <div className="containerh skeleton" key={index}>
              <Skeleton height={340} width={340} />
              <h1 className="h_1">
                <Skeleton width={200} />
              </h1>
              <p className="p-p">
                <Skeleton count={3} />
              </p>
              <button className="rounded add_btn">
                <Skeleton width={180} height={36} />
              </button>
            </div>
          ))}
        </div>
      ) : error ? (
        <p>Error loading events: {error.message}</p>
      ) : (
        <div style={backgroundImageStyle}>
          <div className="cards-container">
            {data.map((item) => (
              <div className="containerh" key={item.iId}>
                <div className="wrapper">
                  <div className="banner-image">
                    <img
                      src={item.sThumbnail}
                      alt={item.sThumbnail}
                      style={{ width: "340px", height: "11rem" }}
                    />
                  </div>
                  <h1 className="h_1">{item.sEventTitle}</h1>
                  <p className="p-p">{item.sDiscription}</p>
                </div>
                <div className="button-wrapper">
                  <div className="from-to">
                    <p>
                      <strong>From:</strong>
                      <>{formatDate(item.sFromDate)}</>
                    </p>
                    <p>
                      <strong>To: </strong>
                      {formatDate(item.sToDate)}
                    </p>
                  </div>
                  <button className="rounded add_btn">
                    <NavLink
                      to={`/Home/DynamicForm/${item.sEventId}`}
                      state={{ from: "AddButton" }}
                      className="nav-link"
                    >
                      Add Registration Link
                    </NavLink>
                    <Outlet />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home1;
