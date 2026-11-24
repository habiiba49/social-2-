"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCache = withCache;
const container_1 = __importDefault(require("../../lib/di/container"));
const tokens_1 = require("../di/tokens");
const cacheProvider = container_1.default.resolve(tokens_1.TOKENS.CacheProvider);
function withCache(ttl = 3600) {
    return async (req, res, next) => {
        let key = `${req.method}: ${req.originalUrl}`;
        const cached = await cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-cache', "HIT");
            return res.json(JSON.parse(cached));
        }
        const originalJson = res.json.bind(res);
        res.json = ((body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cacheProvider.set(key, JSON.stringify(body), ttl);
                res.setHeader('X-Cache', "MISS");
            }
            return originalJson(body);
        });
        next();
    };
}
