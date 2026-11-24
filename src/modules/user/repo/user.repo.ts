import { Iuser } from "../interface/user.interface"
import { AbstractRepository } from "../../../db/models/apstracted.repository"
import { User } from "../model/user.model"
import { HydratedDocument, Model } from "mongoose"
import { injectable } from "tsyringe"



@injectable()
export class UserRepo extends AbstractRepository<Iuser>{

constructor(){
    super(User as unknown as Model<Iuser>)
}
 async findbyEmail (email: String): Promise< HydratedDocument<Iuser> | null> {
    return User.findOne({email: email.toLowerCase()})
 

 
} }
