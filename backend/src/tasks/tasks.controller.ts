import {
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";

import { TasksService } from "./tasks.service.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";

@Controller("tasks")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}