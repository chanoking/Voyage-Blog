import { prisma } from "../utils/prisma/index.js";

export class PostsRepository {
  createPost = async (email, password, title, content) => {
    const createdPost = await prisma.posts.create({
      data: {
        email,
        password,
        title,
        content,
      },
    });

    return createdPost;
  };

  findAllPosts = async () => {
    const posts = await prisma.posts.findMany();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await prisma.posts.findUnique({
      where: { postId: +postId },
    });

    return post;
  };

  updatePost = async (password, content, title, postId) => {
    const updatedPost = await prisma.posts.update({
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
    const deletedPost = await prisma.posts.delete({
      where: { postId: +postId, password: password },
    });
    return deletedPost;
  };
}
