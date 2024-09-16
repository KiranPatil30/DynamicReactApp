import React, { Component } from 'react'

export default class Sample extends Component {
  render() {
    const SignIn =()=>{
        const [mobile, setMobile] = useState("");
       const [password, setPassword] = useState("");
    }
    return (
      <div>
        <form className="sign-in-form">
      <h2 className="title">Sign In</h2>
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

      <input type="submit" value="Login" className="btn solid" />
      {/* <p className="social-text">Or Sign in with social platforms</p> */}

      {/* <div className="social-media">
        <a href="#" className="social-icon">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="social-icon">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="social-icon">
          <i className="fab fa-google"></i>
        </a>
        <a href="#" className="social-icon">
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div> */}
      {/* <IconComp/> */}
    </form>

      </div>
    )
  }
}
