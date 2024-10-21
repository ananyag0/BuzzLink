import { useState } from 'react';
// import auth0 from 'auth0-js';
import './Login.css';


function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // create a function to handle the form submission
  const handleSubmit = (e) => {
    //do not reload the page
    e.preventDefault();
    //send information to console
    console.log("User:", email , "\nPassword:", password);
    //alert the user using dialog box
    window.alert(`User: ${email} \nPassword: ${password}`);

    //can access the user's input for email and password here, connect to backend?
  }

  // const {
  //   user,
  //   isAuthenticated,
  //   loginWithRedirect,
  //   logout,
  // } = useAuth0();




  return (

    <div className = 'bgDeco'>
      <div className = 'mainContainer'>
          <div className= 'logo'>BuzzLink</div>
          <br/>
          <form className = 'logInForm' action={handleSubmit}>
              <input type='email' className = 'field' name = 'email' placeholder = "Email" onInput={(e) => setEmail(e.currentTarget.value)}></input>
            <br/>
              <input type='password' className = 'field' name = 'password' placeholder = "Password" onInput={(e) => setPassword(e.currentTarget.value)}></input>
            <br/> <br/>
              <button className='submitButton' type="submit">Log In</button>
        </form>
        <br/>
        <a href= "/forgot" target = "_blank" className='forgotPassword'>Forgot Password?</a>
        <br/>
        <div className='orDivider'>—————<div className='smallSizeOr'> OR </div>—————</div>
        <br/>
        <a href = "/create" target = "_blank" className='createAccount'>Create Account</a>
      </div>
    </div >

  )

}

export default Login
