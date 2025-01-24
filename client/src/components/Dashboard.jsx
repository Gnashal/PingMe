import axios from "axios"
import { useEffect, useState, useRef, useContext } from "react"
import { NoTokenError } from "./errors/NoToken";
import { handleMouseDown } from '../components/utilities/resize'
import './styles/dashboard.css'
import send_button_icon from '../assets/send.svg'
import search_icon from '../assets/search.svg'
import { UserContext } from "../UserContext";

export default function Dashboard() {
    const [tokenResponse, setTokenResponse] = useState('');
    const [isAuthorized, setAuthorization] = useState(false);
    const [fListWidth, setFListWidth] = useState(30); 
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [ws, setWs] = useState(null);
    const resizerRef = useRef();
    const [searchEntry, setSearchEntry] = useState('')
    const { id, username } = useContext(UserContext);
    useEffect(() => {
        async function verifyToken() {
            const usrId = sessionStorage.getItem('id')
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

    useEffect( () => {
        const userData = {
            username,
            id
        }
            const ws =  new WebSocket('ws://localhost:4000/messages')
            setWs(ws)
            ws.onopen = () => {
                ws.send(JSON.stringify(userData))
            },
            ws.addEventListener('message', handleOnlineUsers)
        
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                const disconnectMsg = {
                    id: userData.id ,
                    action: 'disconnect'
                };
                ws.send(JSON.stringify(disconnectMsg))
            }
            ws.close();
        }
    }, [username, id])

    function handleOnlineUsers(ev) {
        const userMetaData = JSON.parse(ev.data)
        console.log(userMetaData)
    }

    async function handleSearch(ev) {
        ev.preventDefault();
        try {
            const response = await axios.get('/get-user', {
                params: {
                    username: searchEntry
                },
            });
            if (response.data.sucess && response.data.data.gotUser) {
                const addResponse = await axios.post('/new-session', {
                    userId: sessionStorage.getItem('id'),
                    chatUserId: response.data.data.gotUser._id,
                });
                if (addResponse.data.sucess) {
                    setChatList(prevChatList => [...prevChatList, user]);
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

    if (!isAuthorized) {
        return <NoTokenError message={tokenResponse}/>
    }
    return(
        <>
       <div className="dash-wrapper">
        <div className="fList-wrapper" style={{ width: `${fListWidth}%` }}>
        <form className="search-box" onSubmit={handleSearch}>
            <button className="search-button" type="submit">
            <img src={search_icon} alt="search-button" />
            </button>
            <input 
            type="text"
            value={searchEntry}
            onChange={e => setSearchEntry(e.target.value)}
            placeholder="Search for Users" />
        </form>
        friends list</div>
        <div
                ref={resizerRef}
                className="resizer"
                onMouseDown={() => handleMouseDown(setFListWidth)}
            ></div>
        <div className="chat-wrapper" style={{ width: `${100 - fListWidth}%` }}>
            <div className="messages">messages</div>
                <form className="send-message-form"> 
                    <input type="text" placeholder="  Send Message"/>
                    <button className="sendButton" type="submit">
                    <img src={send_button_icon} alt="send button icon"/>
                    </button>
                </form>
        </div>
       </div>
        </>
    )
}