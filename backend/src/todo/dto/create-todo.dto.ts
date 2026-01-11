import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Finish assignment' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Todo backend with Nest + JWT auth', required: false })
  description?: string;
}
