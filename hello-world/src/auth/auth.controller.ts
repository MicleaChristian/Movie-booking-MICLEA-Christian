import { Controller, Get, Req, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req) {
    try {
      console.log('Decoded user:', req.user); // Log the decoded user
      if (!req.user) {
        throw new InternalServerErrorException('User not found in request');
      }
      return req.user; // Return the decoded JWT payload
    } catch (error) {
      console.error('Error in /me endpoint:', error.message); // Log the error
      throw new InternalServerErrorException('Failed to retrieve user information');
    }
  }
}
