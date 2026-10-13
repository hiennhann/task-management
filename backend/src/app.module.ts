import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TasksModule } from "./tasks/tasks.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TasksModule,
  ],
})
export class AppModule {}