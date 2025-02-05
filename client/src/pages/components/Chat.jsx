import "../styles/chats.css"

export function Chat({currChat}) {
    
    return (
        <>
        <div className="chats-container">
            <h1>Messages here</h1>
            {currChat &&(
                <p>{currChat.username}</p>
            )}    
        </div>
        </>
    )
}