"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./db/connection");
const app_1 = require("./app");
const node_http_1 = __importDefault(require("node:http"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./lib/config/env");
const app = (0, app_1.createApp)();
const server = node_http_1.default.createServer(app);
server.listen(env_1.env.port, () => {
    console.log(`app is running on port ${env_1.env.port}`);
});
async function shutdown() {
    await mongoose_1.default.disconnect();
    server.close();
    process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
