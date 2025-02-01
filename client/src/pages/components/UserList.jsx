import '../styles/userlist.css'
import { useState, useEffect } from 'react';
export function UserList({user, sendUserData}) {
    const [bgColor, setBgColor] = useState("");
    const currSessionUser= {
        username: user.username ,
        id: user._id,
    }
    const firstLetter = currSessionUser.username[0];

    useEffect(() => {
      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
  
      setBgColor(`linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`);
    }, []);
    return (
        <>
            <div className="user-container" onClick={() => sendUserData(currSessionUser)}>
                <div className="profile-pic" style={{ background: bgColor }}>{firstLetter} </div>
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