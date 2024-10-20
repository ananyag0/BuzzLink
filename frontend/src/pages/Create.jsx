import { useState } from 'react';
import './Create.css';

function Create(){

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // create a function to handle the form submission
    const handleSubmit = (e) => {
    //do not reload the page
    e.preventDefault();
    //send information to console
    console.log("User:", email , "\nPassword:", password, "\nName:", name, "\nConfirmed Password:", confirmPassword);
    //alert the user using dialog box
    window.alert(`User: ${email} \nPassword: ${password} \nName: ${name} \nConfirmed Password: ${confirmPassword}`);

    //can access the user's input for email and password here, connect to backend?
  }

    return(

        <div className = 'bgDeco'>
            <div className = 'mainContainer'>
                <div className= 'logo'>BuzzLink</div>
                <br/>
                <form className = 'logInForm' action={handleSubmit}>
                    <input className='nameField' placeholder = 'Name' onInput={(e) => setName(e.currentTarget.value)}></input>
                    <br/>
                    <div className='orDivider'>————————————</div>
                    <br/>
                    <input type='email' className = 'field' name = 'email' placeholder = "Email" onInput={(e) => setEmail(e.currentTarget.value)}></input>
                    <br/>
                    <input type='password' className = 'field' name = 'password' placeholder = "Password" onInput={(e) => setPassword(e.currentTarget.value)}></input>
                    <br/>
                    <input type='password' className = 'field' name = 'password' placeholder = "Confirm Password" onInput={(e) => setConfirmPassword(e.currentTarget.value)}></input>
                    <br/> <br/>
                    <button className='submitButton' type="submit">Sign Up</button>
                </form>
            </div>
        </div >

    )
}

export default Create