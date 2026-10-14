import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { TasksService } from "./tasks.service.js";

import { CreateTaskDto } from "./dto/create-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";
import { FilterTaskDto } from "./dto/filter-task.dto.js";

@Controller("tasks")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  createTask(
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(dto);
  }

  @Get()
  getAllTasks(
    @Query() query: FilterTaskDto,
  ) {
    if (query.status) {
      return this.tasksService.filterTasksByStatus(
        query.status,
      );
    }

    return this.tasksService.getAllTasks();
  }

  @Get(":id")
  getTaskById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.tasksService.getTaskById(id);
  }

  @Patch(":id")
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(
      id,
      dto,
    );
  }

  @Delete(":id")
  deleteTask(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.tasksService.deleteTask(id);
  }
}