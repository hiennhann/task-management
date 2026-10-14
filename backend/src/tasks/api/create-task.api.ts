import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateTaskDto } from "../dto/create-task.dto.js";

export async function createTaskApi(
  prisma: PrismaService,
  dto: CreateTaskDto,
) {
  return prisma.task.create({
    data: {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      dueDate: dto.dueDate
        ? new Date(dto.dueDate)
        : undefined,
    },
  });
}