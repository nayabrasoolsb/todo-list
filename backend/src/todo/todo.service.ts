import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TodoStatus } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';


@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  createTodo(dto: CreateTodoDto, username: string) {
    return this.prisma.todo.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdBy: username,
      },
    });
  }

  findAllTodos() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  updateTodoStatus(id: number, status: TodoStatus) {
    return this.prisma.todo.update({
      where: { id },
      data: { status },
    });
  }

  async findTodoById(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  deleteTodoById(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
