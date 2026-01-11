import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('todo/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      example: {
        username: 'alice',
        password: 'alice@wonderland',
      },
    },
  })
  login(
    @Body() body: { username: string; password: string },
  ) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
