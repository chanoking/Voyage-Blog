import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

/**댓글 등록 API */
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const { content } = req.body;

      const post = await prisma.posts.findFirst({
        where: {
          postId: +postId,
        },
      });
      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: "게시글이 존재하지 않습니다." });
      }

      const comment = await prisma.comments.create({
        data: {
          UserId: +userId,
          PostId: +postId,
          content: content,
        },
      });

      return res.status(201).json({ data: comment });
    } catch (err) {
      next(err);
    }
  }
);

/**댓글 조회 API */
router.get("/posts/:postId/comments", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId,
      },
    });
    if (!post)
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    const comments = await prisma.comments.findMany({
      where: {
        PostId: +postId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ data: comments });
  } catch (err) {
    next(err);
  }
});

/**댓글 수정 API*/
router.put(
  "/posts/:postId/comments/commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content, password } = req.body;

      const comment = await prisma.comments.findUnique({
        where: { commentId: +commentId },
      });

      if (!comment)
        return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
      else if (comment.password !== password) {
        return res
          .status(401)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      await prisma.comments.update({
        data: { content },
        where: {
          commentId: +commentId,
          password,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**댓글 삭제 API */
router.delete(
  "/posts/:postId/comments/commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { password } = req.body;

      const comment = await prisma.comments.findFirst({
        where: { commentId: +commentId },
      });
      if (!comment)
        return res
          .status(404)
          .json({ message: "해당 댓글이 존재하지 않습니다." });
      else if (comment.password !== password)
        return res
          .status(401)
          .json({ message: "비밀번호가 일치하지 않습니다." });

      await prisma.comments.delete({ where: { commentId: +commentId } });
      return res.status(200).json({ message: "댓글 삭제가 완료되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
