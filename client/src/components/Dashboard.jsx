import axios from "axios"
import { useEffect, useState, useRef, useContext } from "react"
import { NoTokenError } from "./errors/NoToken";
import { handleMouseDown } from '../components/utilities/resize'
import './styles/dashboard.css'
import send_button_icon from '../assets/send.svg'
import { UserContext } from "../UserContext";

export default function Dashboard() {
    const [tokenResponse, setTokenResponse] = useState('');
    const [isAuthorized, setAuthorization] = useState(false);
    const [fListWidth, setFListWidth] = useState(30); 
    // const [onlineUsers, setOnlineUsers] = useState([]);
    const [ws, setWs] = useState(null);
    const resizerRef = useRef();
    const { id, username } = useContext(UserContext);
    useEffect(() => {
        async function verifyToken() {
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

    if (!isAuthorized) {
        return <NoTokenError message={tokenResponse}/>
    }
    return(
        <>
       <div className="dash-wrapper">
        <div className="fList-wrapper" style={{ width: `${fListWidth}%` }}>friends list</div>
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