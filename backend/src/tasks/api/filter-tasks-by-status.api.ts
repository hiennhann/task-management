import { PrismaService } from "../../prisma/prisma.service.js";
import { TaskStatus } from "../../generated/prisma/enums.js";

export async function filterTasksByStatusApi(
  prisma: PrismaService,
  status: TaskStatus,
) {
  return prisma.task.findMany({
    where: {
      status,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}