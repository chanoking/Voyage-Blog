import { PostsRepository } from "../repositories/posts.repository.js";

export class PostsService {
  postsRepository = new PostsRepository();

  createPost = async (email, password, title, content) => {
    // 저장소에게 데이터를 요청
    const createdPost = await this.postsRepository.createPost(
      email,
      title,
      content,
      password
    );

    return {
      postId: createdPost.postId,
      email: createdPost.email,
      content: createdPost.content,
      title: createdPost.title,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };

  findAllposts = async () => {
    // 저장소에게 데이터 요청
    const posts = await this.postsRepository.findAllposts();

    // 호출한 Post들을 최신 게시글 부터 정렬
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공
    return posts.map((post) => {
      return {
        postId: post.postId,
        email: post.email,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findPostById = async (postId) => {
    const post = await this.postsRepository.findPostById(postId);
    return {
      postId: post.postId,
      email: post.email,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  updatePost = async (postId, content, password, title) => {
    const post = await this.postsRepository.findPostById(postId);

    if (!post) throw new Error("존재하지 않는 게시글입니다. ");

    await this.postsRepository.updatePost(title, content, password, postId);

    const updatedPost = await this.postsRepository.findPostById(postId);

    return {
      postId: updatedPost.postId,
      content: updatedPost.content,
      title: updatedPost.title,
      email: updatedPost.email,
      password: updatedPost.password,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  };

  deletePost = async (password, postId) => {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error("게시글이 존재하지 않습니다.");

    await this.postsRepository.deletePost(postId, password);

    return {
      postId: post.postId,
      content: post.content,
      title: post.title,
      password: post.password,
      email: post.email,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };
}
