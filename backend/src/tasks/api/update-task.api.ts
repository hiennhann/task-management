import { NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";
import { UpdateTaskDto } from "../dto/update-task.dto.js";

export async function updateTaskApi(
  prisma: PrismaService,
  id: number,
  dto: UpdateTaskDto,
) {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new NotFoundException(
      `Không tìm thấy công việc có id ${id}`,
    );
  }

  return prisma.task.update({
    where: { id },

    data: {
      ...(dto.title !== undefined && {
        title: dto.title,
      }),

      ...(dto.description !== undefined && {
        description: dto.description,
      }),

      ...(dto.status !== undefined && {
        status: dto.status,
      }),

      ...(dto.dueDate !== undefined && {
        dueDate: new Date(dto.dueDate),
      }),
    },
  });
}