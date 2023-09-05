import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
// import { postsController } from '../controllers/posts.controller.js';

const router = express.Router();

// PostController의 인스턴스 생성
// const PostsController = new PostsController();

/**게시글 생성 API */
router.post("/posts", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, content } = req.body;

    const post = await prisma.posts.create({
      data: {
        UserId: userId,
        title,
        content,
      },
    });

    return res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
});

/**게시글 목록 조회 API */
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      select: {
        postId: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
});

/** 게시글 상세 조회 API */
router.get("/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
      select: {
        postId: true,
        title: true,
        content: true,
        user: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
});

/**게시글 수정 */
router.put("/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, password, title } = req.body;

    const post = await prisma.posts.findUnique({
      where: { postId: +postId },
    });

    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    } else if (post.password !== password) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    await prisma.posts.update({
      data: { title, content },
      where: {
        postId: +postId,
        password,
      },
    });

    return res.status(200).json({ data: "게시글이 수정되었습니다." });
  } catch (err) {
    next(err);
  }
});

/**게시글 삭제 */
router.delete("/posts/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;

    const post = await prisma.posts.findFirst({ where: { postId: +postId } });

    if (!post)
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });
    else if (post.password !== password) {
      return res.status(401).json({ message: "패스워드가 일치하지 않습니다." });
    }
    await prisma.posts.delete({ where: { postId: +postId } });
    return res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
