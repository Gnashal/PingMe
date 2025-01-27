import '../styles/userlist.css'

export function UserList({user, sendUserData}) {
    const currSessionUser= {
        username: user.username ,
        id: user._id,
    }
    return (
        <>
            <div className="user-container" onClick={() => sendUserData(currSessionUser)}>
                <ul>
                    <li>
                        <strong>{user.username}</strong>
                        <p>{user._id}</p>
                    </li>
                </ul>
            </div>
        </>
    )
}