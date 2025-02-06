import axios from "axios"
import { useEffect, useState, useRef, useContext } from "react"
import { NoTokenError } from "./errors/NoToken";
import { handleMouseDown } from './utilities/resize'
import './styles/dashboard.css'
import send_button_icon from '../assets/send.svg'
import search_icon from '../assets/search.svg'
import start_msg from "../assets/startmessage.svg"
import { UserContext } from "../UserContext";
import { UserList } from "./components/UserList";
import { UserProfile } from "./components/UserProfile";
import { Settings } from "./components/Settings";
import { Chat } from "./components/Chat";

export default function Dashboard() {
    const [tokenResponse, setTokenResponse] = useState('');
    const [isAuthorized, setAuthorization] = useState(false);
    const [settingsClicked, setSettingsClicked] = useState(false);
    const [fListWidth, setFListWidth] = useState(30); 
    const [chatList, setChatList] = useState([]);
    const [currChat, setCurrChat] = useState({});
    const [newMsg, setNewMsg] = useState('');
    const resizerRef = useRef();
    const ws = useRef(null);
    const [searchEntry, setSearchEntry] = useState('');
    const { id, username } = useContext(UserContext);
    useEffect(() => {
        async function verifyToken() {
            const usrId = id
                if (!usrId) {
                    setTokenResponse("No Credentials");
                    console.error("No Id found in Session");
                    return;
                }
            try {
                await axios.get('/verify-token')
                setTokenResponse('')
                setAuthorization(true);
                return;

            } catch(err) {
                setTokenResponse("Unauthorized Entry")
                console.error(err)
                return;
            }
        }
        verifyToken();
    }, [])

   useEffect(() => {
    async function fetchUserSessions() {
        try {
            const response = await axios.get('/fetch-sessions', {
                params: {
                    userId: id,
                }
            })
            if (response.data.success) {
                const sessions = response.data.data.sessions;
                
                const otherUsers = sessions.flatMap(session => 
                    session.participants.filter(participant => participant._id !== id)
                )

                setChatList(otherUsers);
            }
        } catch (err) {
            console.error("Error fetching user sessions, ", err);
            return;
        }
    }
    fetchUserSessions();
   }, [id]) 

   useEffect(() => {
        ws.current = new WebSocket("ws://localhost:4000/messages")
        ws.current.onopen = () => {   
            console.log("Connected to ws")
        }
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.current.close(); 
        };
   }, [])
    async function handleSearch(ev) {
        ev.preventDefault();
        console.log(searchEntry)
        try {
            const response = await axios.get('/get-user', {
                params: {
                    username: searchEntry
                },
            });
            if (response.data.success && response.data.data.gotUser) {
                const searchedUser = response.data.data.gotUser;
                const addResponse = await axios.post('/new-session', {
                    userId: sessionStorage.getItem('id'),
                    chatUserId: response.data.data.gotUser._id,
                });
                if (addResponse.data.success) {
                    setChatList(prevChatList => [...prevChatList, searchedUser]);
                } else {
                    console.error("Failed to add user to chat list:", addResponse.data.message);
                    return;
                }
            } else {
                console.error("User not Found");
                return;
            }
        } catch(err) {
            console.error(err);
            return;
        }
    }

    function sendMessage(ev) {
        ev.preventDefault();
        if (!newMsg.trim()) return;
        const msgData={
            from : id ,
            to : currChat.id ,
            content: newMsg 
        }
        if (ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({msgData}));
            setNewMsg("");
        } else {
            console.error("Websocket Error")
        }
    }

    const handleUserListData = (data) => {
        setCurrChat(data);
    }

    if (!isAuthorized) {
        return <NoTokenError message={tokenResponse}/>
    }
    return(
        <>
         {settingsClicked && (
        <div className="settings-overlay" onClick={() => setSettingsClicked(false)}>
        <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
            <Settings />
        </div>
    </div>
    )}
       <div className="dash-wrapper">
        <div className="user-list-wrapper" style={{ width: `${fListWidth}%` }}>
        <form className="search-box" onSubmit={handleSearch}>
            <button className="search-button" type="submit">
            <img src={search_icon} alt="search-button" />
            </button>
            <div className="search-input-container">
                <input 
                type="text"
                value={searchEntry}
                onChange={e => setSearchEntry(e.target.value)}
                />
            <span className="btn-shine">Search for Users</span>
            </div>
        </form>
        <div className="user-list-container">
            <h3>Chats</h3>
            {chatList.length === 0 ? (
                <p>No active chats. Start by searching for users to chat with</p>
            ): (
                chatList.map((user) => (
                    <UserList key={user._id} user={user} sendUserData={handleUserListData} />
                ))
            )}
            </div>
                <div className="user-profile">
                  <UserProfile userData={{id, username}} onSettingsClicked={setSettingsClicked}/>
                </div>
        </div>
        <div
                ref={resizerRef}
                className="resizer"
                onMouseDown={() => handleMouseDown(setFListWidth)}
            ></div>
        <div className="chat-wrapper" style={{ width: `${100 - fListWidth}%` }}>
       
                {currChat.username ?(
                    <>
                    <div className="curr-chat-profile">
                        <h1>{currChat.username}</h1>
                    </div>
                    <Chat currChat={currChat}/>
                    </>
                ): (
                    <div className="welcome-msg-wrapper">
                        <img src={start_msg} alt="start-message" className="welcome-msg" />
                    </div>
                )}
                <form className="send-message-form" onSubmit={sendMessage}> 
                    <input
                    value={newMsg}
                    onChange={ev => setNewMsg(ev.target.value)} 
                    type="text" 
                    placeholder="  Send Message"/>
                    <button className="sendButton" type="submit">
                    <img src={send_button_icon} alt="send button icon"/>
                    </button>
                </form>
        </div>
       </div>
        </>
    )
}