import { data, Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import './styles/login.css'
import { useState } from 'react'
import axios from 'axios'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setSubmitStatus] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(user, pass) {
        try {
            const api_res = await axios.post('/login', {user, pass})
        if (api_res.status === 200) {
            setSubmitStatus(true);
        } else {
            setError('Unexpected response from the server.');
            console.error(api_res);
        }
        } catch (err) {
            console.error(err);
            setError('Error contacting the database. Please try again later.');
        }
        
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username || !password) {
        setError("Missing Fields!");
        return;
        }
        try {
           const response = await axios.post('/verify-user', {username, password})
           if (response.status === 200) {
            handleLogin(username, password)
            setError('');
            return;
           } else {
            setError('Your account does not exist!');
            console.error(response);
         }

        } catch (err) {
            console.error(err);
            setError('Error contacting the database. Please try again later.');
        } 
    }

        if (isSubmitted) {
            navigate('/dashboard')
        }
    return (
        <>
        <img src={logo} alt="PingMe Logo" className="logo" /> 
        <div className="login-wrapper">
            <div className="form-wrapper">
            {error && <div className="error">{error}</div>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Login now!</h1>
                    <input 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)}
                    type="text" 
                    placeholder="username"/>
                    <input 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)}
                    type="password" 
                    placeholder="password"/>
                    <div className='button-wrapper'>
                        <Link to="/" className="link-tag">No Account? Register here</Link>
                        <button className='login-button' type='submit'>Login</button>
                     </div>
                </form>
            </div>
        </div>
        </>
    )
}