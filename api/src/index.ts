import swagger from "@elysiajs/swagger";
import { Elysia , t } from "elysia";
import mongoose from "mongoose";
import User from '../models/User';

const url: any = process.env.MONGO_URL;
console.log(url);

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

async function registerUser(data: { username: string; password: string }) {
  try {
    const { username, password } = data;
    const newUser = await User.create({ username, password });
    return { success: true, message: "User created successfully", user: newUser };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, message: "Failed to create user", error: err };
  }
}


const app = new Elysia()
.use(swagger())
.get('/test', 'Hello from backend')
.post('/register', ({ body }) => registerUser(body), {
  body : t.Object({
    username: t.String(),
    password: t.String(),
  })
})
.listen(4000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
