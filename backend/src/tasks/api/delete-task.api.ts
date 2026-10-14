import { NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";

export async function deleteTaskApi(
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

  await prisma.task.delete({
    where: { id },
  });

  return {
    message: "Xóa công việc thành công",
    id,
  };
}