import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email,
                password,
            });
            if (response.status === 200) {
                alert(response.data.message);
            }
            else if (response.status === 400) {
                alert(response.data.message);
                console.log(response.data.message);
            }
            else if (response.status === 500) {
                alert('Internal Server Error');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:3001/logout');
            if (response.status === 200) {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed:');
        }
    };


    return (
        <div>
            <h1>Login Page</h1>
            <label>
                Email:
                <input type="text" value={email} onChange={handleEmailChange} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} />
            </label>
            <br />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default LoginPage;
