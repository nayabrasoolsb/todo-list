import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/crate-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const pepper = process.env.PASSWORD_PEPPER!;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      dto.password + pepper,
      saltRounds,
    );
  
    return this.prisma.user.create({
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
