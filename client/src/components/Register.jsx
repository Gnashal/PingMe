import { Link } from "react-router-dom";
import './styles/register.css';
import logo from '../assets/logo.jpg'
import { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
   
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPass) {
            setError("Password does not match! Try again")
        }else if (!password || !username || !confirmPass) {
            setError("Missing Fields!")
        } else {
            setError('');
        }
    }
    return (
        <>
         <img src={logo} alt="PingMe Logo" className="logo" /> 
        <div className="reg-wrapper">
            <div className="form-wrapper">
                {error && <div className="error">{error}</div>}
                <form className="user-reg-form" onSubmit={handleSubmit}>
                    <h1>Welcome to PingMe!</h1>
                    <input 
                    value={username} 
                    onChange={ev =>setUsername(ev.target.value)} 
                    type="text" 
                    placeholder="username"/>
                    <input 
                    value={password}
                    onChange={ev =>setPassword(ev.target.value)} 
                    type="password" 
                    placeholder="password"/>
                    <input 
                    value={confirmPass}
                    onChange={ev =>setConfirmPass(ev.target.value)} 
                    type="password" 
                    placeholder="confirm password"/>
                    <div className="button-wrapper">
                        <Link to="/login" className="link-tag">Have an account already? Login</Link>
                        <button type="submit" className="sign-up-button">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}