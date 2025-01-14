import swagger from "@elysiajs/swagger";
import { Elysia , t } from "elysia";
import mongoose from "mongoose";
import User from '../models/User';
import cors from '@elysiajs/cors'
import bcrypt from 'bcrypt'
import jwt from '@elysiajs/jwt'

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

async function verifyPassword(plainPassword: string, hashedPassword: string | any): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch(err) {
    console.error("Error verifying", err);
    return false;
  }
}

async function registerUser(data: { username: string; password: string}) {
  try {
    const { username, password } = data;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ username, password: hashedPassword });
    return { success: true, message: "User created successfully", user: newUser };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, message: "Failed to create user", error: err };
  }
}

async function verifyUser(data: {username: string, password: string}) {
  try {
    const {username, password} = data;
    const user = await User.findOne({username})
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const isMatch = await verifyPassword(password, user?.password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }
    return { success: true, user };
  } catch(err) {
    console.error(err);
    return {success: false, mesage: "An error occured"}
  }
}

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

.post('/register', ({ body }) => registerUser(body), {
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
  console.log(token)

  return {
    success: true,
    message: "Login successful.",
    data: { token }, 
    status: 200,  
  };
}, {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  })
})
.listen({
  port: 4000
})

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
