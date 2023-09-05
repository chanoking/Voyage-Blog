import express from "express";
import PostsRouter from "./routes/posts.router.js";
import commentsRouter from "./routes/comments.router.js";
import UsersRouter from "./routes/users.router.js";
import cookieParser from "cookie-parser";
import logMiddleware from "./middlewares/log.middleware.js";
import expressSession from "express-session";
import expressMySQLSession from "express-mysql-session";
import dotenv from "dotenv";
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";

// .env 파일을 읽어서 process.env에 추가
dotenv.config();

const app = express();
const PORT = 3000;
const router = express.Router();

// MySQLStore를 Express-Session을 이용해 생성
const MySQLStore = expressMySQLSession(expressSession);
// MySQLStore를 이용해 세션 외부 스토리지 선언
const sessionStore = new MySQLStore({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24,
  createDatabaseTable: true, // 세션 테이블을 자동으로 생성
});

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(logMiddleware);
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET_KEY, // 세션을 암호화하는 비밀키 설정
    resave: false, // 클라이언트의 요청이 올 때마다 세션을 새롭게 저장할 지 설정, 변경사항이 없어도 다시 저장
    saveUninitialized: false, // 세션이 초기화되지 않았을 때 세션을 저장할 지 설정
    store: sessionStore, // 외부 세션 스토리지를 MySQLStore로 설정
    cookie: {
      // 세션 쿠키 설정
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 만료 기간을 1일로 설정
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", [router, PostsRouter, commentsRouter, UsersRouter]);
app.use(errorHandlingMiddleware);

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
