import '../styles/userlist.css'

export function UserList({user}) {
    return (
        <>
            <div className="user-container">
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