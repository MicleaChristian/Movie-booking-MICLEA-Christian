import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
            const jwt = token.split('=')[1];
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then(response => setUser(response.data))
            .catch(() => document.cookie = 'token=; Max-Age=0'); // Clear invalid token
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies" element={<MainPage user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;
