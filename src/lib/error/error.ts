export class AppError extends Error {
     public statusCode!: number ;
     public isOperatioinal! : boolean; 

    constructor(message: string ,  statusCode: number, isOperatioinal: boolean= true ){
        super (message)
        this.statusCode = statusCode;
        this.isOperatioinal= isOperatioinal; 
        Error.captureStackTrace(this, this.constructor);
    }
}

