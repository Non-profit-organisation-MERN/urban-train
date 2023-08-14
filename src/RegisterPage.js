import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
        if (!email || !password) {
            setErrorMessage('Email and password are required');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setErrorMessage('Password must contain at least one uppercase letter');
            return;
        }

        if (!/[0-9]/.test(password)) {
            setErrorMessage('Password must contain at least one number');
            return;
        }

        if (!/[!@#$%^&*]/.test(password)) {
            setErrorMessage('Password must contain at least one special character');
            return;
        }

        try {
            await axios.post('http://localhost:3001/register', {
                email,
                password,
            });
            alert('Registration successful');
            setEmail('');
            setPassword('');
            setErrorMessage('');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('Email already exists');
            } else {
                alert('Registration failed');
            }
        }
    };
    return (
        <div>
            <h1>Register</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
            />
            <br />
            <div style={{ position: 'relative' }}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <button
                    onClick={toggleShowPassword}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '40%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        style={{ fontSize: '1.2rem' }}
                    />
                </button>
            </div>
            <br />
            <button onClick={handleRegister}>Register</button>
            <button>
                <Link to="/login">Login</Link>
            </button>
        </div>

    );
}

export default RegisterPage;
