import React from 'react';
import './HomeComponents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export function RoomGrid() {
    // Sample room data
    const rooms = [
        { id: 1, roomName: "WebDev @ GT", participantCount: 20, tag: "Homework" },
        { id: 2, roomName: "BuzzLink UI/UX", participantCount: 15, tag: "Club" },
        { id: 3, roomName: "React Workshop", participantCount: 30, tag: "Class" },
        { id: 4, roomName: "JavaScript Basics", participantCount: 25, tag: "Seminar" },
    ];

    // Function to handle the join button click
    const handleJoin = (roomName) => {
        alert(`You have joined the room: ${roomName}`);
    };

    return (
        <>
            <div className="room-grid">
                {rooms.map((room) => (
                    <div key={room.id} className="room-card">
                        <div className="room-card-header">
                            <div className="participant-count">
                                <div className="participant-icon-container">
                                    <FontAwesomeIcon icon={faUser} className="participant-icon" />
                                </div>
                                <span className="participant-number">{room.participantCount}+</span>
                            </div>
                        </div>
                        <div className="room-card-footer">
                            <p className="room-name">{room.roomName}</p>
                            <div className="room-tag">
                                {room.tag}
                            </div>
                            <button
                                className="join-room-button"
                                onClick={() => handleJoin(room.roomName)}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default RoomGrid;
