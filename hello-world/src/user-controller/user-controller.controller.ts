import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto, LoginDto } from './user-controller.dto';

@Controller('user-controller')
export class UserControllerController {
  @Post('auth/register')
  register(@Body() registerDto: RegisterDto): string {
    return 'User registered successfully';
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto): string {
    return 'User logged in successfully';
  }
}