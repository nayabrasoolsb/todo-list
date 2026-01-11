import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('todo/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(
    @Body() body: { username: string; password: string },
  ) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
