import { CommentsService } from "../services/comments.service.js";

export class CommentsController {
  commentsService = new CommentsService();

  createComment = async (req, res, next) => {
    try {
      const { email, password, content } = req.body;

      const createdComment = await this.commentsService.createComment(
        email,
        content,
        password
      );

      return res.status(201).json({ data: createdComment });
    } catch (err) {
      next(err);
    }
  };

  getComments = async (req, res, next) => {
    try {
      const comments = await this.commentsService.findAllComments();

      return res.status(200).json({ data: comments });
    } catch (err) {
      next(err);
    }
  };

  getCommentById = async (req, res, next) => {
    try {
      const { commentId } = req.params;

      const comment = await this.commentsService.findCommentById(commentId);

      return res.status(200).json({ data: comment });
    } catch (err) {
      next(err);
    }
  };

  updateComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { password, content } = req.body;

      const updatedComment = await this.commentsService.updateComment(
        commentId,
        password,
        content
      );

      return res.status(200).json({ data: updatedComment });
    } catch (err) {
      next(err);
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { password } = req.body;

      const deletedComment = await this.commentsService.deleteComment(
        commentId,
        password
      );

      return res.status(200).json({ data: deletedComment });
    } catch (err) {
      next(err);
    }
  };
}
