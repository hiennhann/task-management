import { PrismaService } from "../../prisma/prisma.service.js";

export async function getAllTaskApi(
  prisma: PrismaService,
) {
  return prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}