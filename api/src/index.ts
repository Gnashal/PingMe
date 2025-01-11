import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { MongoClient } from "mongodb";

const url: any = process.env.MONGO_URL;
const db_client = new MongoClient(url);
console.log(url);

async function connectDb() {
  try {
    await db_client.connect()
    console.log("Success");
  } catch (err) {
    console.log("Not success")
    if (err) throw err;
  }
}

connectDb();


const app = new Elysia()
.use(swagger())
.get('/test', 'Hello from backend')
.listen(4000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
