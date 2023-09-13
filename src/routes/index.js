import express from "express";
import PostsRouter from "./posts.router.js";
import CommentsRouter from './comments.router.js'

const router = express.Router();

router.use("/posts/", [PostsRouter, CommentsRouter] );

export default router;
