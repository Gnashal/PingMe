import swagger from "@elysiajs/swagger";
import { Context, Elysia , t } from "elysia";
import cors from '@elysiajs/cors'
import jwt from '@elysiajs/jwt'
import mongoose from "mongoose";
import {  registerUser, verifyUser } from '../middleware/auth.ts'
import { ElysiaWS } from "elysia/dist/ws/index";
import { getUser } from "../middleware/user.ts";

const url: any = process.env.MONGO_URL;
console.log(url);
console.log(process.env.CLIENT_URL);

async function connectDb() {
  try {
    await mongoose.connect(url)
    console.log("Success");

  } catch (err) {
    console.log("Not success")
    if (err) throw err;
  }
}
connectDb();

let users = new Map();



const app = new Elysia()
.use(swagger())
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}
app.use(jwt({ secret: process.env.JWT_SECRET }))
.use(cors({
  credentials: true,
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
.ws('/messages', {
    open: (ws: ElysiaWS) => {
      console.log("WebSocket open");
    },
    message: (ws, body: any) => {
      try {
        if (!body || !body.id) {
          console.error("Invalid User creds ", body)
          return;
        }
        if (!users.has(body.id)) {
          users.set(body.id, body)
        } else {
          console.log("Already Online")
        }

        console.log("Online Users:");
        users.forEach((user) => {
            console.log(user);
        });
        const usersArray = Array.from(users.values());
        ws.send(JSON.stringify(usersArray));

      } catch (error) {
          console.error("Error processing message: ", error);
      }
      
    },
    close: (ws, body: any) => {
      try {
        if (body && body.id) {
            if (users.has(body.id)) {
                console.log(`Removing User: ${body.id}`);
                users.delete(body.id);
            } else {
                console.error(`User with ID ${body.id} not found.`);
            }
        } else {
            console.error("Invalid user data on close:", body);
        }
    } catch (err) {
        console.error("Error deleting user:", err);
    }
    }
})

.post('/register', async ({ body, set }) => {
  const {success, user, error, message} = await registerUser(body)
  if (!success || !user) {
    set.status = 401;
    return {success: false, Error: error, message}
  } 
  set.status = 201;
  return {success: true, message, user};
}, {
  body : t.Object({
    username: t.String(),
    password: t.String(),
  })
})

.post('/login', async ({body, jwt, cookie: {auth}}) => {
  const {success, UserData: user, message} = await verifyUser(body)
  if (!success || !user) {
    return { success: false, message}
  }
  const token = await jwt.sign({ userName: user.username, userPw: user.password });
  auth.set({
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 86400,
  })
  console.log(`Logged in user:: ${user._id} with token: ${token}`)
  const userData = {
    userID: user._id,
    userName: user.username
  }
  return {
    success: true,
    message: "Login successful.",
    userData: userData,
    status: 200,  
  };
}, {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  })
})
.post('/verify-user', async ({body}) => {
  const {success, UserData:user, message} = await verifyUser(body)
  if (!success || !user) {
    return {success: false, message}
  }
  return {
    success: true,
    message: "Verification Succesful",
    data: { user }, 
    status: 200,  
  };
}, 
{
  body: t.Object({
    username: t.String(),
    password: t.String()
  })
})
.get('/verify-token', async ({jwt, set, cookie: { auth }}) => {
  if (!auth) {
    set.status = 401;
    return {success: false, message: "No Token"}
  }
  try {
    const token_accepted = await jwt.verify(auth.value);
    if (!token_accepted) {
      set.status = 401;
      return {success: false, message: "Unauthorized"}
    }
    set.status = 202;
    return { success: true, message: "User Verified"}
  } catch (err) {
    set.status = 401;
    return {success: false, message: "Unauthorized", Error: err}
  }
})
.get('/get-users', async ({set, body}) => {
    const {success, User: gotUser, Error, status} = await getUser(body);
    if (!success && !gotUser) {
      set.status = status
      return {success: false, Error}
    }
    return {
      success: true,
      data: { gotUser },
      status: 200
    }
},
  {
    body: t.Object({
      username: t.String(),
    })
  }
)
.listen({
  port: 4000
})

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
