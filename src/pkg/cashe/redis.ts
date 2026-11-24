import Redis from "ioredis";
import { ICasheProvider } from "./cashe.interface";

interface IRedisConfig {
    host : string , 
    port : number , 
    password : string
}


export class redisCasheProvider implements ICasheProvider{
    private client: any;

    constructor(config: IRedisConfig ){
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3
        });

        this.client.on('error',(err: Error)=>console.log('redisserver error', err.message));
        this.client.connect().catch(( err: Error) =>console.log('fail to connect to redis', err.message));
    }
    
    async set(key: string , value: string , ttl: number ){
       return this.client.set(key, value, 'EX', ttl);
    }
   
    async get(key: string){
        return this.client.get(key)

    }
    
    async del(key: string){
        return this.client.del(key)

    }
    async ttl ( key: string){
        return this.client.ttl(key);

    }
}

  