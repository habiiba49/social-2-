import { NextFunction , Request, Response} from "express";
import container from "../../lib/di/container";
import { ICasheProvider } from "../../pkg/cashe/cashe.interface";
import { TOKENS } from "../di/tokens";


const cacheProvider  = container.resolve<ICasheProvider>(TOKENS.CacheProvider)

export function withCache (ttl= 3600) {
    return async (req: Request , res: Response , next : NextFunction) => {
        let key = `${req.method}: ${req.originalUrl}`;
        const cached = await cacheProvider.get(key); 
        if (cached) {
            res.setHeader('X-cache', "HIT");
            return res.json(JSON.parse(cached));
        }
        const originalJson = res.json.bind(res)

        res.json = ((body) => {
            if (res.statusCode >=  200 && res.statusCode < 300 ){
                cacheProvider.set(key, JSON.stringify(body), ttl );
                res.setHeader('X-Cache', "MISS");
            }
             return originalJson(body);
        })

        next();

    }
}
