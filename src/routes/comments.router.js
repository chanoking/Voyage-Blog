import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { CommentsController } from "../controllers/comments.controller.js";
import { CommentsService } from "../services/comments.service.js";
import { CommentsRepository } from "../repositories/comments.repository.js";

const router = express.Router();

//  인스턴스 생성
const commentsRepository = new CommentsRepository(prisma);
const commentsService = new CommentsService(commentsRepository);
const commentsController = new CommentsController(commentsService);

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
