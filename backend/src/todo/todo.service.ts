import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TodoStatus } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';


@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTodoDto, username: string) {
    return this.prisma.todo.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdBy: username,
      },
    });
  }

  findAll() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: number, status: TodoStatus) {
    return this.prisma.todo.update({
      where: { id },
      data: { status },
    });
  }

  delete(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
