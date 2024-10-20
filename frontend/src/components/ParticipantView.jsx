

export function ParticipantView({participant}) {
    return (
        <>
            <div className="participant-view">
                <div className="participant-video"></div>
                <div className="participant-name">
                    {participant.displayName}
                </div>
            </div>
        </>
    )
}