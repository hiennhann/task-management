import { Transform } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

import { TaskStatus } from "../../generated/prisma/enums.js";

export class UpdateTaskDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString({
    message: "title phải là chuỗi",
  })
  @MinLength(1, {
    message: "title không được để trống",
  })
  @MaxLength(100, {
    message: "title không được vượt quá 100 ký tự",
  })
  title?: string;

  @IsOptional()
  @IsString({
    message: "description phải là chuỗi",
  })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: "status chỉ được là TODO, IN_PROGRESS hoặc DONE",
  })
  status?: TaskStatus;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: "dueDate phải là ngày hợp lệ",
    },
  )
  dueDate?: string;
}