import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import './styles/login.css'
import { useState } from 'react'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!username || !password) {
            setError("Missing Fields!");
        } 
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