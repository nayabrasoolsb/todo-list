import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(username: string, password: string) {
    try {

      const user = await this.usersService.findByUsername(username);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      const pepper = process.env.PASSWORD_PEPPER!;
      const isValid = await bcrypt.compare(
        password + pepper,
        user?.password,
      );

      if (!isValid) {
        throw new UnauthorizedException("Incorrect password");
      }

      const payload = {
        sub: user?.id,
        username: user?.username,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Error occurred while logging in"
      );
    }
  }
}
