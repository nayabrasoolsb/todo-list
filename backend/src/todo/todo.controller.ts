import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  createTodo(@Body() dto: CreateTodoDto, @Req() req) {
    return this.service.createTodo(dto, req.user.username);
  }

  @Get()
  findAllTodos(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new BadRequestException(
        'page and limit must be positive numbers',
      );
    }

    return this.service.findAllTodos(pageNumber, limitNumber);
  }

  @Patch(':id/status')
  updateTodoStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTodoStatusDto,
  ) {
    return this.service.updateTodoStatus(Number(id), dto.status);
  }

  @Get(':id')
  findTodoById(@Param('id') id: string) {
    return this.service.findTodoById(Number(id));
  }

  @Delete(':id')
  deleteTodoById(@Param('id') id: string) {
    return this.service.deleteTodoById(Number(id));
  }
}
