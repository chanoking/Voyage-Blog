export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  createPost = async (req, res, next) => {
    try {
      const { email, password, title, content } = req.body;
      console.log(email, password, title, content)

      if (!email || !password || !title || !content) {
        throw new Error("InvalidParamsError");
      }

      const createPost = await this.postsService.createPost(
        email,
        password,
        title,
        content
      );
      console.log(createPost);
      return res.status(201).json({ data: createPost });
    } catch (err) {
      next(err);
    }
  };

  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const { postId } = req.params;

      const post = await this.postsService.findPostById(postId);

      return res.status(200).json({ data: post });
    } catch (err) {
      next(err);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { password, title, content } = req.body;

      const updatedPost = await this.postsService.updatePost(
        postId,
        title,
        password,
        content
      );

      return res.status(200).json({ data: updatedPost });
    } catch (err) {
      next(err);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { password } = req.body;

      const deletedPost = await this.postsService.deletePost(postId, password);

      return res.status(200).json({ data: deletedPost });
    } catch (err) {
      next(err);
    }
  };
}
