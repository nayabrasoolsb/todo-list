import { IsEnum } from 'class-validator';
import { TodoStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoStatusDto {
  @IsEnum(TodoStatus)
  @ApiProperty({ enum: TodoStatus })
  status: TodoStatus;
}
