import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { NoTokenError } from "./errors/NoToken";
import { handleMouseDown } from '../components/utilities/resize'
import './styles/dashboard.css'
import send_button_icon from '../assets/send.svg'

export default function Dashboard() {
    const [tokenResponse, setTokenResponse] = useState('');
    const [isAuthorized, setAuthorization] = useState(false);
    const [fListWidth, setFListWidth] = useState(30); 
    const [ws, setWs] = useState(null);
    const resizerRef = useRef();

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

   

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000/messages')
        setWs(ws)
        ws.onopen = () => {
            ws.send("Hello Server")
        },
        ws.onmessage = (msg) => {
            console.log(msg.data)
        }
        return () => {
            ws.close();
        }
    }, [])

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