"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireBaseProvider = void 0;
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
class FireBaseProvider {
    client;
    constructor(config) {
        this.client = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(config)
        });
    }
    async SendMail(to, title, body) {
        const message = {
            token: to,
            notification: {
                title,
            }
        };
        await (0, messaging_1.getMessaging)(this.client).send(message);
    }
}
exports.FireBaseProvider = FireBaseProvider;
