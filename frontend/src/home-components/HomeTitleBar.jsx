import React, { useState } from 'react';
import '../components/Components.css';
import './HomeComponents.css';

export function HomeTitlebar() {
    // State to manage the current status
    const [status, setStatus] = useState('online');

    // Handler function to update the status
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    return (
        <>
            <div className="titlebar">
                <p className="title">BuzzLink</p>
                <div className="profile-icon-container">
                    <img 
                        src="./buzzpfp.png"
                        alt="Profile" 
                        className="profile-icon" 
                    />
                    <div className={`status-indicator ${status}`}></div>
                </div>
                <select className="status-selector" value={status} onChange={handleStatusChange}>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="dnd">Do Not Disturb</option>
                </select>
            </div>
            <div className="divider"></div>
        </>
    );
}

export default HomeTitlebar;
