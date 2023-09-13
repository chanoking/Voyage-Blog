import { expect, jest } from "@jest/globals";
import { PostsRepository } from "../../../src/repositories/posts.repository";

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  posts: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let postsRepository = new PostsRepository(mockPrisma);

describe("Posts Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findAllPosts Method", async () => {
    const mockReturn = "findMany String";
    mockPrisma.posts.findMany.mockReturnValue(mockReturn);

    const posts = await postsRepository.findAllPosts();

    expect(posts).toBe(mockReturn);

    expect(postsRepository.prisma.posts.findMany).toHaveBeenCalledTimes(1);
  });

  test("createPost Method", async () => {
    const mockReturn = "create Post Return String";
    mockPrisma.posts.create.mockReturnValue(mockReturn);

    const createPostParams = {
      email: "createdEmail",
      password: "createPassword",
      title: "createTitle",
      content: "createContent",
    };

    const createPostData = await postsRepository.createPost(
      createPostParams.email,
      createPostParams.password,
      createPostParams.title,
      createPostParams.content
    );

    expect(createPostData).toEqual(mockReturn);

    expect(mockPrisma.posts.create).toHaveBeenCalledTimes(1);

    expect(mockPrisma.posts.create).toHaveBeenCalledWith({
      data: {
        email: createPostParams.email,
        password: createPostParams.password,
        title: createPostParams.title,
        content: createPostParams.content,
      },
    });
  });
});
