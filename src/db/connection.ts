import mongoose from "mongoose";
import { env } from "../lib/config/env";
mongoose.connect(env.db.url);