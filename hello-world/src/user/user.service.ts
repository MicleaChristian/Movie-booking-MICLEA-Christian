import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  private users: { username: string; password: string }[] = []; // Temporary in-memory storage

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    const userExists = this.users.find((user) => user.username === username);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    this.users.push({ username, password: hashedPassword });
    const token = this.jwtService.sign({ username });
    return { message: 'User registered successfully', token };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = this.users.find((user) => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { accessToken: token, message: 'User logged in successfully' };
  }
}
