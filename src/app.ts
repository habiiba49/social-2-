
import express from "express" ;
import cookieParser from "cookie-parser";
import {router} from './route'; 
import { globalErrorHandeler } from "./lib/error/error.handeler";


export function createApp (){
    const app = express();
    app.use(express.json());
    app.use('/api', router); 
    app.use(cookieParser());
    app.use(globalErrorHandeler);

    return app ;

}