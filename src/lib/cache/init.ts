import { redisCasheProvider } from "../../pkg/cashe/redis";
import{env} from "../config/env";

export const cacheProvider = new redisCasheProvider({
    host: env.redis.host, 
    port: env.redis.port,
    password: env.redis.password || ''
});