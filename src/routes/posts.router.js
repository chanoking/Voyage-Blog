import express from "express";
import { PostsController } from "../controllers/posts.controller.js";

const router = express.Router();

// PostController의 인스턴스 생성
const postsController = new PostsController();

/** 게시글 작성 API */
router.post("/", postsController.createPost);

/**게시글 조회 API */
router.get("/", postsController.getPosts);

/** 게시글 상세 조회 */
router.get("/:postId", postsController.getPostById);

/** 게시글 수정 API */
router.put("/:postId", postsController.updatePost);

/** 게시글 삭제 API */
router.delete("/:postId", postsController.deletePost);

export default router;
