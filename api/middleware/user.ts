import User from "../models/User";
import ChatSession from '../models/ChatSession'

export async function getUser(data: {username: string}) {
    const {username} = data;
    if (!username) {
        return {success: false, Error: "No arguments passed", status: 401};
    }
    const user = await User.findOne({username});
    if (!user) {
        return {success : false, Error: user, status: 401};
    }
    return {success: true, User: user, status: 200};
}

export async function addToChatSession(body : {userId: any, chatUserId: any}) {
    if (!body || !body.userId || !body.chatUserId) {
        return { success: false, message: "Missing userId or chatUserId", status: 400 };
    }
    const {userId, chatUserId} = body;

    try {
        const existingSession = await ChatSession.findOne({
            participants: { $all: [userId, chatUserId]},
        });
        if (existingSession) {
            return {success: false, status: 400, message: "Session already exists"};
        }

        const newSession = await ChatSession.create({
            participants: [userId, chatUserId]
        });
        
        return {success: true, message: "New Session Created!", data: newSession, status: 201};

    } catch (err) {
        console.error("Unexpected Error: ", err);
        return {success: false, message: err, status: 500};
    }

}