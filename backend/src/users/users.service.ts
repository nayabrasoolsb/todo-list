import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/crate-user.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createUser(dto: CreateUserDto) {
    const pepper = process.env.PASSWORD_PEPPER!;
    const saltRounds = 10;

    try {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }

      const usernameExists = await this.findByUsername(dto.username);

      if (usernameExists) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await bcrypt.hash(
        dto.password + pepper,
        saltRounds,
      );

      return await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          username: dto.username,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create user',
      );
    }
  }
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
  }

}
