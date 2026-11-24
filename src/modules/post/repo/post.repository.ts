
import { injectable } from "tsyringe";
import { AbstractRepository } from "../../../db/models/apstracted.repository";
import { IPost } from "../interface/post.interface";
import { Post } from "../model/post.model";

@injectable()
export class PostRepo extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }
}