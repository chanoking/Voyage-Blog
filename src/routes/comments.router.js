import express from "express";
import { CommentsController } from "../controllers/comments.controller.js";

const router = express.Router();

// CommentController의 인스턴스 생성
const commentsController = new CommentsController();

/** 댓글 작성 API */
router.post("/:postId/comment", commentsController.createComment);

/**댓글 조회 API */
router.get("/:postId/comment", commentsController.getComments);

/** 댓글 상세 조회 */
router.get("/:postId/comment/:commentId", commentsController.getCommentById);

/** 댓글 수정 API */
router.put("/:postId/commment/:commentId", commentsController.updateComment);

/** 댓글 삭제 API */
router.delete("/:postId/comment/:commentId", commentsController.deleteComment);

export default router;
