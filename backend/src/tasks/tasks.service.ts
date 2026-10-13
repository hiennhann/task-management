import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({
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

  findAll() {
    return this.prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}