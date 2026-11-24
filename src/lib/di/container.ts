
import { container } from 'tsyringe';
import { UserService } from "../../modules/user/service/user.service";
import { UserController } from "../../modules/user/controller/user.controller";
import { UserRepo } from "../../modules/user/repo/user.repo";
import { TOKENS } from "./tokens";
import { s3CloudProvider } from '../cloud/init'
import { cacheProvider } from '../cache/init';
import { mailjetProvider, nodemailerProvider } from '../email/init';
import { AuthService } from '../../modules/auth/service/auth.service';
import { AuthController } from '../../modules/auth/controller/auth.controller';
import { AuthRepo } from '../../modules/auth/repo/auth.repo';
import { PostRepo } from '../../modules/post/repo/post.repository';
import { PostService } from '../../modules/post/service/post.service';
import { PostController } from '../../modules/post/controller/post.controller';
import { CommentRepo } from '../../modules/comment/repo/comment.repo';
import { CommentService } from '../../modules/comment/service/comment.service';
import { CommentController } from '../../modules/comment/controller/comment.controller';


container.registerSingleton(TOKENS.UserService, UserService);
container.registerSingleton(TOKENS.AuthService, AuthService)
container.registerSingleton(TOKENS.UserController, UserController);
container.registerSingleton(TOKENS.AuthController, AuthController); 
container.registerSingleton(TOKENS.AuthRepo, AuthRepo);
container.registerSingleton(TOKENS.UserRepo, UserRepo);
container.registerSingleton(TOKENS.PostRepo, PostRepo);
container.registerSingleton(TOKENS.PostService, PostService);
container.registerSingleton(TOKENS.PostController, PostController);
container.registerSingleton(TOKENS.CommentRepo, CommentRepo);
container.registerSingleton(TOKENS.CommentService, CommentService);
container.registerSingleton(TOKENS.CommentController, CommentController);
container.registerInstance(TOKENS.S3CloudProvider, s3CloudProvider);
container.registerInstance(TOKENS.CacheProvider, cacheProvider);
container.registerInstance(TOKENS.NodemailerProvider, nodemailerProvider); 
container.registerInstance(TOKENS.MailjetProvider, mailjetProvider);
container.registerInstance(TOKENS.CloudProvider, s3CloudProvider);

export default container; 






