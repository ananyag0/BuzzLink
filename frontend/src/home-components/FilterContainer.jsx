import React, { useState } from 'react';
import './HomeComponents.css';

export function FilterContainer({ onCreateRoom }) {
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: '',
        participants: '',
        availability: ''
    });

    const handleFilterChange = (filter, value) => {
        setSelectedFilters({
            ...selectedFilters,
            [filter]: value
        });
    };

    return (
        <div className="filter-container">
            <div className="filters-label">
                Filters:
            </div>
            <div className="filter-buttons">
                <select 
                    className="filter-button" 
                    value={selectedFilters.roomType} 
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                >
                    <option value="">Room Type</option>
                    <option value="Club">Club</option>
                    <option value="Class">Class</option>
                    <option value="Seminar">Seminar</option>
                </select>
                <select 
                    className="filter-button" 
                    value={selectedFilters.participants} 
                    onChange={(e) => handleFilterChange('participants', e.target.value)}
                >
                    <option value=""># Participants</option>
                    <option value="1-10">1-10</option>
                    <option value="11-20">11-20</option>
                    <option value="21+">21+</option>
                </select>
                <select 
                    className="filter-button" 
                    value={selectedFilters.availability} 
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                >
                    <option value="">Availability</option>
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                </select>
                <button className="add-filter-button">+</button>
            </div>
            <button className="create-room-button" onClick={onCreateRoom}>
                Create Room <span className="plus-icon">+</span>
            </button>
        </div>
    );
}

export default FilterContainer;
