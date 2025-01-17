import axios from "axios"
import { useEffect, useState } from "react"
import { NoTokenError } from "./NoToken";

export default function Dashboard() {
    const [tokenResponse, setTokenResponse] = useState('');
    const [isAuthorized, setAuthorization] = useState(false);
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

    if (!isAuthorized) {
        return <NoTokenError message={tokenResponse}/>
    }
    return(
        <>
        <h1>Hello World</h1>
        </>
    )
}