import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @ApiOperation({ summary: 'Get the currently signed-in user' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return req.user; // `req.user` contains the decoded JWT payload
  }
}
