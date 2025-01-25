import { Link, useNavigate } from "react-router-dom";
import './styles/register.css';
import logo from '../assets/logo.jpg'
import { useEffect, useState } from "react";
import axios from "axios";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setSubmitStatus] = useState(false);

    const navigate = useNavigate();
   
    async function handleSubmit(e){
        e.preventDefault();
        if (password !== confirmPass) {
            setError("Password does not match! Try again")
            return;
        }else if (!password || !username || !confirmPass) {
            setError("Missing Fields!")
            return;
        } 
        setError('');
        try {
            const api_res = await axios.post('/register', { username, password });
    
            if (api_res.status === 201) {
                setSubmitStatus(true);
            } else {
                setError('Unexpected response from the server.');
                console.error(api_res);
            }
        } catch (err) {
            console.error(err);
            setError('Error contacting the database. Please try again later.');
        }
    };

    useEffect(() => {
        if (isSubmitted) {
            navigate('/login')
        }
    }, [isSubmitted])
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