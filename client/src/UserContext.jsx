import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [username, setUsername] = useState(() => sessionStorage.getItem('username') || null);
    const [id, setId] = useState(() => sessionStorage.getItem('id') || null);

    useEffect(() => {
        if (username) sessionStorage.setItem('username', username);
        if (id) sessionStorage.setItem('id', id);
    }, [username, id]);

    if (username && id) {
        console.log("User Logged in", username, id)
    }

    return(
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}