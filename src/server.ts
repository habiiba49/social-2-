import "reflect-metadata";
import "./db/connection"; 
import {createApp} from "./app";
import http from "node:http";
import mongoose from "mongoose";
import { env } from "./lib/config/env";

const app = createApp ();
const server = http.createServer(app);

server.listen(env.port, () =>{
console.log(`app is running on port ${env.port}`);
})

async function  shutdown(){
    await mongoose.disconnect();
    server.close();
    process.exit(0);

}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);