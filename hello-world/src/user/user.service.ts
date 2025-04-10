import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Check if the user already exists
    const userExists = await this.userRepository.findOne({ where: [{ username }, { email }] });
    if (userExists) {
      throw new BadRequestException('User with this username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = this.userRepository.create({ username, email, password: hashedPassword });
    await this.userRepository.save(user);

    // Generate a token
    const token = this.jwtService.sign({ username, email });

    return { message: 'User registered successfully', token };
  }

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;

    // Find the user by email or username
    const user = await this.userRepository.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token
    const payload = { username: user.username, email: user.email };
    const token = this.jwtService.sign(payload);

    return { user, token, message: 'User logged in successfully' };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });
    return user || undefined;
  }
}
