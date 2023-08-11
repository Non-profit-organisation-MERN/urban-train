import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3001/register', {
                username,
                password,
            });
            alert('Registration successful');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
            />
            <br />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default RegisterPage;
