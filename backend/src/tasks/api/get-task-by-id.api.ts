import { NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";

export async function getTaskByIdApi(
  prisma: PrismaService,
  id: number,
) {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new NotFoundException(
      `Không tìm thấy công việc có id ${id}`,
    );
  }

  return task;
}