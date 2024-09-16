import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Panels from "./Panels";
import "./Parent.css"; // Ensure your CSS is correctly imported

const App = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {isSignUpMode ? <SignUp /> : <SignIn />}
        </div>
      </div>
      <Panels toggleMode={toggleMode} />
    </div>
  );
};

export default App;
