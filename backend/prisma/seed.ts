import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { TaskStatus } from "../src/generated/prisma/enums.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "Hoàn thành backend",
        description: "Làm API NestJS",
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date("2026-10-15"),
      },
      {
        title: "Thiết kế database",
        description: "Tạo bảng Task bằng Prisma",
        status: TaskStatus.DONE,
      },
      {
        title: "Học Docker Compose",
        status: TaskStatus.TODO,
        dueDate: new Date("2026-10-16"),
      },
      {
        title: "Viết README",
        status: TaskStatus.TODO,
      },
      {
        title: "Kiểm tra API",
        description: "Test POST và GET",
        status: TaskStatus.TODO,
      },
    ],
  });

  console.log("Seed thành công");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });