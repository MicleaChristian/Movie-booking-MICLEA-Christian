import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending login request:', { usernameOrEmail, password }); // Debugging
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                usernameOrEmail,
                password,
            });
            console.log('Login response:', response.data); // Debugging
            if (response.data.user) {
                document.cookie = `token=${response.data.token}; Path=/`; // Store token in a cookie
                setUser(response.data.user); // Update the user state
                setError('');
                navigate('/movies'); // Redirect to the movies page
            } else {
                throw new Error('User data is missing in the response');
            }
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message); // Debugging
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="usernameOrEmail">Username or Email:</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => navigate('/register')}>Go to Register</button>
        </div>
    );
}

export default Login;
