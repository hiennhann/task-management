import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";

import { CreateTaskDto } from "./dto/create-task.dto.js";

import { createTaskApi } from "./api/create-task.api.js";
import { getAllTaskApi } from "./api/get-all-task.api.js";
import { getTaskByIdApi } from "./api/get-task-by-id.api.js";
import { updateTaskApi } from "./api/update-task.api.js";
import { deleteTaskApi } from "./api/delete-task.api.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";
import { TaskStatus } from "../generated/prisma/enums.js";

import { filterTasksByStatusApi } from "./api/filter-tasks-by-status.api.js";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  createTask(dto: CreateTaskDto) {
    return createTaskApi(
      this.prisma,
      dto,
    );
  }

  getAllTasks() {
    return getAllTaskApi(
      this.prisma,
    );
  }

  getTaskById(id: number) {
    return getTaskByIdApi(
      this.prisma,
      id,
    );
  }
  updateTask(
  id: number,
  dto: UpdateTaskDto,
) {
  return updateTaskApi(
    this.prisma,
    id,
    dto,
  );
}

deleteTask(id: number) {
  return deleteTaskApi(
    this.prisma,
    id,
  );
}
filterTasksByStatus(status: TaskStatus) {
  return filterTasksByStatusApi(
    this.prisma,
    status,
  );
}
}