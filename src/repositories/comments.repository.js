import { prisma } from "../utils/prisma/index.js";

export class CommentsRepository {
  createComment = async (email, password, content) => {
    const createdComment = await prisma.comments.create({
      data: {
        email,
        password,
        content,
      },
    });

    return createdComment;
  };

  findAllComments = async () => {
    const comments = await prisma.comments.findMany();

    return comments;
  };

  findCommentById = async (commentId) => {
    const comment = await prisma.comments.findUnique({
      where: { commentId: +commentId },
    });

    return comment;
  };

  updateComment = async (password, content, commentId) => {
    const updatedComment = await prisma.comments.update({
      where: {
        commentId: +commentId,
        password: password,
      },
      data: {
        content,
      },
    });

    return updatedComment;
  };

  deleteComment = async (commentId, password) => {
    const deletedComment = await prisma.comments.delete({
      where: { commentId: +commentId, password: password },
    });
    return deletedComment;
  };
}
