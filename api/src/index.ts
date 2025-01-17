import swagger from "@elysiajs/swagger";
import { Elysia , t } from "elysia";
import cors from '@elysiajs/cors'
import jwt from '@elysiajs/jwt'
import mongoose from "mongoose";
import { registerUser, verifyUser } from '../middleware/auth.ts'

const url: any = process.env.MONGO_URL;
console.log(url);
console.log(process.env.CLIENT_URL);

async function connectDb() {
  try {
    const response = await mongoose.connect(url)
    console.log("Success");

  } catch (err) {
    console.log("Not success")
    if (err) throw err;
  }
}
connectDb();



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
.get('/test', 'Hello from backend')

.post('/register', async ({ body }) => {
  const {success, user, error, message} = await registerUser(body)
  if (!success || !user) {
    return {success: false, Error: error, message}
  } 
  console.log()
}, {
  body : t.Object({
    username: t.String(),
    password: t.String(),
  })
})

.post('/login', async ({body, jwt, cookie: {auth}}) => {
  const {success, user, message} = await verifyUser(body)
  if (!success || !user) {
    return { success: false, message}
  }
  const token = await jwt.sign({userId: user.password});
  auth.set({
    value: token,
    httpOnly: true
  })
  console.log(`Logged in user:: ${user} with toke: ${token}`)

  return {
    success: true,
    message: "Login successful.",
    data: { token, user }, 
    status: 200,  
  };
}, {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  })
})
.post('/verify-user', async ({body}) => {
  const {success, user, message} = await verifyUser(body)
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
.listen({
  port: 4000
})

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
