import express from "express";
import Posts from "../schemas/posts.js";

const router = express.Router();

/**게시글 등록 API */
router.post("/posts", async (req, res, next) => {
  // 1. 클라이언트로부터 받아온 value 데이터를 가져온다.
  const { title, user, password, content } = req.body;

  /** 내용이 비어 있을 경우 클라이언트에게 에러 메시지를 전달한다.  */
  if (!content) {
    return res.status(400).json({ errorMessage: "게시글을 입력해주세요" });
  }

  // 2. 게시글 등록
  const posts = new Posts({ title, user, password, content });
  await posts.save();

  /** 3. 게시글 등록 결과를 클라이언트에게 반환 */
  return res.status(200).json({ posts });
});

/** 게시글 상세 조회(제목) */
router.get("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const postSearch = await Posts.findOne({ _id:postId }).exec();

  return res.status(200).json({ postSearch });
});

/**게시글 목록 조회 */
router.get("/posts/", async (req, res, next) => {
  // 1. 조회 진행
  const postLists = await Posts.find().sort({ date: -1 }).exec();

  // 2. 목록 조회 결과를 클라이언트에게 반환
  return res.status(200).json({ postLists });
});

/**게시글 삭제 */
router.delete("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await Posts.findById({ postId }).exec();

  if (!post) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않은 데이터입니다." });
  }
  await Posts.deleteOne({ _id: postId });

  return res.status(200).json({});
});

/**게시글 수정 */
router.put("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const { content, password } = req.body;

  const postUpdate = await Posts.findById(postId).exec();
  if (!postUpdate) {
    return res
      .status(404)
      .json({ errorMessage: "해당 게시물이 존재하지 않습니다." });
  }
  if (password !== postUpdate.password) {
    return res
      .status(404)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
  }

  await Posts.updateOne({ _id: postId }, { $set: { content } });

  return res.status(200).json({});
});
export default router;
