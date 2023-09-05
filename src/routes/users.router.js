import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const router = express.Router();

/**사용자 회원가입 API (에러 처리 미들웨어) */
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, profileImage } = req.body;
    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (isExistUser) {
      return res.status(409).json({ message: "동일한 이메일입니다." });
    }

    // 사용자 비밀번호를 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // MySQL과 연결된 Prisma 클라이언트를 통해 트랜잭션을 실행
    const [user, userInfo] = await prisma.$transaction(
      async (tx) => {
        // Users 테이블에 사용자 추가
        const user = await tx.users.create({
          data: {
            email,
            password: hashedPassword, // 암호화된 비밀번호 저장
          },
        });
        // UserInfos 테이블에 사용자 추가
        const userInfos = await tx.userInfos.create({
          data: {
            UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보 생성
            name,
            age,
            gender: gender.toUpperCase(),
            profileImage,
          },
        });

        // 콜백 함수의 리턴값으로 사용자와 사용자 정보를 반환
        return [user, userInfo];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(201).json({ message: "회원가입을 축하드립니다." });
  } catch (err) {
    next(err);
  }
});

/**로그인 API */
router.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ meessage: "비밀번호가 일치하지 않습니다." });
    }

    //로그인에 성공하면, 사용자의 userId를 바탕으로 세션 설정
    req.session.userId = user.userId;

    return res.status(200).json({ message: "로그인 성공" });
  } catch (err) {
    next(err);
  }
});

/** 사용자 정보 조회 API */
router.get("/users", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        UserInfos: {
          // 1:1 관계를 맺고 있는 UserInfos 테이블 조회
          select: {
            name: true,
            gender: true,
            age: true,
            profileImage: true,
          },
        },
      },
    });

    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
});

/** 사용자 정보 변경 */
router.patch("/users", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;

    const userInfo = await prisma.userInfos.findFirst({
      where: { UserId: +userId },
    });

    await prisma.$transaction(
      async (tx) => {
        // 트랜잭션 내부에서 사용자 정보를 수정
        await tx.userInfos.update({
          data: {
            ...updatedData,
          },
          where: {
            UserId: userInfo.UserId,
          },
        });

        // 변경된 필드만 UserHistories 테이블에 저장한다.
        for (let key in updatedData) {
          if (userInfo[key] !== updatedData[key]) {
            await tx.userHistories.create({
              data: {
                UserId: userInfo.UserId,
                changedField: key,
                oldValue: String(userInfo[key]),
                newValue: String(updatedData[key]),
              },
            });
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res
      .status(200)
      .json({ message: "사용자 정보 변경이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
