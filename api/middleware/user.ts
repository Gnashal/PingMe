import User from "../models/User";


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