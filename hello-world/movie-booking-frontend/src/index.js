import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Ensure 'root' matches the div id in index.html
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
