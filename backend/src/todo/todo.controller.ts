import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@ApiBearerAuth('access-token')
@Controller('todo/api/v1/todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Post()
  create(@Body() dto: CreateTodoDto, @Req() req) {
    return this.service.create(dto, req.user.username);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTodoStatusDto,
  ) {
    return this.service.updateStatus(Number(id), dto.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
