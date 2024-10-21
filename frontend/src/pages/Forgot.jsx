import { useState } from "react";
import './Forgot.css';

function Forgot(){

    const [email, setEmail] = useState('')
    // create a function to handle the form submission
    const handleSubmit = (e) => {
        //do not reload the page
        e.preventDefault();
        //send information to console
        console.log("User:", email);
        //alert the user using dialog box
        window.alert(`User: ${email}`);

        //can access the user's input for email, connect to backend?
    }


    return(
        <div className = 'bgDeco'>
            <div className = 'mainContainer'>
                <div className= 'logo'>BuzzLink</div>
                <br/>
                <div className="text">Having Trouble?</div>
                <div className="infotext">We’ll send you an email with information on how to reset your password.</div>
                <br/>
                <form className = 'logInForm' action={handleSubmit}>
                    <input type='email' className = 'field' name = 'email' placeholder = "Email" onInput={(e) => setEmail(e.currentTarget.value)}></input>
                    <br/> <br/>
                    <button className='submitButton' type="submit">Submit</button>
                </form>
            </div>
        </div >

    )
}
export default Forgot