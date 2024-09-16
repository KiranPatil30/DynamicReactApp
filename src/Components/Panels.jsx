import React from 'react';

function Panels({ toggleMode }) {
  return (
    <div className="panels-container">
      <div className="panel left-panel">
        <div className="content">
          <h3>New here ?</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
            ex ratione. Aliquid!
          </p>
          <button className="btn transparent" onClick={toggleMode} id="sign-up-btn" style={{width:'24vh',padding:'10px'}}>
            Registration
          </button>
        </div>
        <img src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" className="image" alt="" />
      </div>
      <div className="panel right-panel">
        <div className="content">
          <h3>One of us ?</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            laboriosam ad deleniti.
          </p>
          <button className="btn transparent" onClick={toggleMode} id="sign-in-btn">
            Sign in
          </button>
        </div>
        <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" className="image" alt="" />
      </div>
    </div>
  );
}

export default Panels;



// import React from "react";

// function Panels({ toggleMode }) {
//   return (
//     <div className="panels-container">
//       <div className="panel left-panel">
//         <div className="content">
//           <h3>New here ?</h3>
//           <p>
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
//             ex ratione. Aliquid!
//           </p>
//           <button
//             className="btn transparent"
//             onClick={toggleMode}
//             id="sign-up-btn"
//           >
//             Registration
//           </button>
//         </div>
//         <img
//           src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
//           className="image"
//           alt=""
//         />
//       </div>
//       <div className="panel right-panel">
//         <div className="content">
//           <h3>One of us ?</h3>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
//             laboriosam ad deleniti.
//           </p>
//           <button
//             className="btn transparent"
//             onClick={toggleMode}
//             id="sign-in-btn"
//           >
//             Sign in
//           </button>
//         </div>
//         <img
//           src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
//           className="image"
//           alt=""
//         />
//       </div>
//     </div>
//   );
// }

// export default Panels;
