import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/like", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = res.locals.user;

    const posts = await prisma.posts.findMany({
      where: {
        Likes: {
          some: {
            UserId: +userId,
          },
        },
      },
      select: {
        postId: true,
        UserId: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            Likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const parseLikePosts = parseLikePostsModel(posts);

    function parseLikePostsModel(posts) {
      return posts.map((post) => {
        let obj = {};

        Object.entries(post).forEach(([key, value]) => {
          if (typeof value === "object" && !(value instanceof Date)) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              obj[subKey] = subValue;
            });
          } else {
            obj[key] = value;
          }
        });
        return obj;
      });
    }

    return res.status(200).json({
      data: parseLikePosts,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    console.log(error);
    return res.status(400).json({
      errorMessage: "좋아요 게시글 조회에 실패하였습니다.",                                                                                                                                                                                                                                                                                         
    });
  }
});
