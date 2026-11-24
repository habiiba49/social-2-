"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const route_1 = require("./route");
const error_handeler_1 = require("./lib/error/error.handeler");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/api', route_1.router);
    app.use((0, cookie_parser_1.default)());
    app.use(error_handeler_1.globalErrorHandeler);
    return app;
}
