import React from 'react';
import { HomeTitleBar } from '../home-components/HomeTitleBar';
import { FilterContainer } from '../home-components/FilterContainer';
import { RoomGrid } from '../home-components/RoomGrid';
import './Home.css';


function Home() {
    // Function to handle the creation of a new room
    const handleCreateRoom = () => {
        alert("implement room creation");
    };

    return (
        <>
            <HomeTitleBar />
            <main>
                <div className="homepage">
                    <FilterContainer onCreateRoom={handleCreateRoom} />
                    <RoomGrid />
                </div>
            </main>
        </>
    );
}

export default Home;
