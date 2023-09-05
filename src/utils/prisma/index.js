import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    // Prisma를 이용해 데이터베이스를 접근할 때, sql 출력
    log: ['query', 'info', 'warn', 'error'],

    // 에러 메시지를 평문이 아닌 개발자가 읽기 쉬운 형태로 출력
    errorFormat: 'pretty',
}); // PrismaClient 인스턴스 생성