export class CommentsService {
  constructor(commentsRepository) {
    this.commentsRepository = commentsRepository;
  }

  createComment = async (email, password, content) => {
    // 저장소에게 데이터를 요청
    const createdComment = await this.commentsRepository.createComment(
      email,
      content,
      password
    );

    return {
      commentId: createdComment.commentId,
      email: createdComment.email,
      content: createdComment.content,
      title: createdComment.title,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
    };
  };

  findAllcomments = async () => {
    const comments = await this.commentsRepository.findAllcomments();

    comments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return comments.map((comment) => {
      return {
        commentId: comment.commentId,
        email: comment.email,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  };

  findCommentById = async (commentId) => {
    const comment = await this.commentsRepository.findCommentById(commentId);
    return {
      commenId: comment.postId,
      email: comment.email,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  };

  updateComment = async (commentId, content, password) => {
    const comment = await this.commentsRepository.findCommentById(commentId);

    if (!comment) throw new Error("존재하지 않는 댓글입니다. ");

    await this.postsRepository.updateComment(content, password, commentId);

    const updatedComment = await this.commentsRepository.findCommentById(
      commentId
    );

    return {
      commentId: updatedComment.commentId,
      content: updatedComment.content,
      email: updatedComment.email,
      password: updatedComment.password,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    };
  };

  deleteComment = async (password, commentId) => {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) throw new Error("댓글이 존재하지 않습니다.");

    await this.commentsRepository.deleteComment(commentId, password);

    return {
      commentId: comment.commentId,
      content: comment.content,
      password: comment.password,
      email: comment.email,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  };
}
