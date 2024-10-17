import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faMessage, faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { VisibilityContext } from './VisibilityContext'
import { useState } from 'react'

export function BottomButtons() {
    //Used to toggle chat visibility across different components
    const {toggleVisibility} = useContext(VisibilityContext);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideo, setIsVideo] = useState(true);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        setIsVideo(!isVideo);
    };

    return (
        <>
            <div className="bottom-buttons-container">
                <button onClick={toggleMute} className="speak-button">
                    <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} size="2x"/>
                </button>
                <button onClick={toggleVideo} className="video-button">
                    <FontAwesomeIcon icon={isVideo ? faVideo : faVideoSlash} size="2x"/>
                </button>
                <button onClick={toggleVisibility} className="chat-button">
                    <FontAwesomeIcon icon={faMessage} size="2x"/>
                </button>
                <button className='leave-button'>Leave Room</button>
            </div>
        </>
    )
}