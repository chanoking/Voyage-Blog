export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createPost = async (email, password, title, content) => {
    const createdPost = await this.prisma.posts.create({
      data: {
        email,
        password,
        title,
        content,
      },
      
    });
    console.log(createdPost);
    return createdPost;
  };

  findAllPosts = async () => {
    const posts = await this.prisma.posts.findMany();

    return posts;
  };

  findPostById = async (postId) => {
    try {
      console.log("hello postid", postId);
      const post = await this.prisma.posts.findUnique({
        where: { postId: +postId },
      });

      return post;
    } catch (err) {
      console.log(err);
    }
  };

  updatePost = async (password, content, title, postId) => {
    const updatedPost = await this.prisma.posts.update({
      where: {
        postId: +postId,
        password: password,
      },
      data: {
        title,
        content,
      },
    });

    return updatedPost;
  };

  deletePost = async (postId, password) => {
    const deletedPost = await this.prisma.posts.delete({
      where: { postId: +postId, password: password },
    });
    return deletedPost;
  };
}
