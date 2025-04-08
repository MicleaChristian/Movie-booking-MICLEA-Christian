import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class UserService {
    private readonly jwtService;
    private users;
    constructor(jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        message: string;
    }>;
}
