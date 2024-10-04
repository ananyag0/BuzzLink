import { Titlebar } from "../components/Titlebar"
import { ParticipantView } from "../components/ParticipantView"

export function Meeting() {

    //Sample Room Participants
    const Krish = {displayName: "Krish"}
    const Sam = {displayName: "Sam"}
    const Josh = {displayName: "Josh"}

    var participants = [Krish, Sam, Josh]

    return (
        <>
            <Titlebar></Titlebar>
            <main>
                {participants.map((participant, i) => { 
                    return (
                        //<ParticipantView participant={participant} key={i}/>
                        <h2 key={i}>{participant.displayName}</h2>
                    )
                })
                }
            </main>
        </>
    )
  }