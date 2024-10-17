import { Titlebar } from "../components/Titlebar"
import { ParticipantView } from "../components/ParticipantView"
import { Chat } from "../components/Chat"
import { BottomButtons } from "../components/BottomButtons"
import { VisibilityProvider } from "../components/VisibilityContext"

export function Meeting() {
    //Sample Room Participants
    const Krish = {displayName: "Krish"}
    const Sam = {displayName: "Sam"}
    const Josh = {displayName: "Josh"}

    var participants = [Krish, Sam, Josh, Krish, Sam, Krish, Krish, Sam, Josh, Krish, Sam, Josh, Krish, Sam, Josh, Krish, Krish, Josh, Sam, Josh, Krish]

    return (
        <>
            <Titlebar></Titlebar>
            <main>
                <VisibilityProvider>
                    <div className="meeting">
                        <div className="participant-grid">
                            {participants.map((participant) => { 
                                    return (
                                        <ParticipantView participant={participant}/>
                                    )
                                })
                            }
                        </div>
                        <Chat></Chat>
                    </div>
                    <BottomButtons></BottomButtons>
                </VisibilityProvider>
            </main>
        </>
    )
  }