import express from "express";
import Comments from "../schemas/comments.js";

const router = express.Router();

/**댓글 등록 API */
router.post("/posts/:postId/comments", async (req, res, next) => {
  // 1. 클라이언트로부터 받아온 value 데이터를 가져온다.
  const { content } = req.body;

  // 2. 내용이 비어 있을 경우 클랑니언트에게 에러 메시지 전달
  if(!content){
    return res.status(400).json({errorMessage:"댓글을 입력하세요"});
  }

  // 3. 댓글 등록
  const comments = new Comments({ content });
  await comments.save();

  // 4. 댓글 클라이언트에게 반환.
  return res.status(201).json({ comments });
});

/**댓글 목록 조회 API */
router.get("/posts/:postId/comments", async (req, res, next) => {
  /** 1. 목록 조회 진행 */
  const commentsList = await Comments.find().sort("-date").exec();

  /** 2. 댓글목록 조회 결과를 클라이언트에게 반환 */
  return res.status(200).json({ commentsList });
});

/**댓글 삭제 */
router.delete("/posts/:postId/comments", async(req, res, next) => {
    const {postId} = req.params;
    const {content} = req.body;

    const comment = await Comments.findById({postId}).exec();
    if(!comment){
        res.status(404).json({errorMessage: "해당 데이터가 없습니다."});
    }
    await Comments.deleteOne({_id: postId});

    return res.status(200).json({});
});

/**댓글 수정 */
router.put("/posts/:postId/comments", async(req, res, next) => {
    const {postId} = req.params;
    const {content} = req.body;

    const commentUpdate = await Comments.findById(postId).exec();
    if(!commentUpdate){
        return res.status(404).json({errorMessage: "댓글을 입력하세요"});
    }
    await Comments.updateOne({_id:postId}, {$set: { content}});
});

export default router;
