import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../../generated/prisma/enums.js";

export class FilterTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: "status chỉ được là TODO, IN_PROGRESS hoặc DONE",
  })
  status?: TaskStatus;
}