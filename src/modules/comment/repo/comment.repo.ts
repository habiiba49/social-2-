import { injectable } from "tsyringe";
import { AbstractRepository } from "../../../db/models/apstracted.repository";
import { IComment } from "../interface/comment.interface";
import { Comment } from "../model/comment.model";

@injectable()
export class CommentRepo extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }
}