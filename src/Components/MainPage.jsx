import React from 'react'
import { useState } from 'react'
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import Panels from "./Panels"
function MainPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  // const [isSignINMode, setIsSignInMode] = useState(true);
  const toggleMode = () => {

    setIsSignUpMode(!isSignUpMode);
  };
  return (
    <div>
      <div className={`container_s ${isSignUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            <SignIn toggleMode={toggleMode}/>
            <SignUp toggleMode={toggleMode}/>
          </div>
        </div>
        <Panels toggleMode={toggleMode} />
      </div>
      
    </div>
   
  )
}

export default MainPage