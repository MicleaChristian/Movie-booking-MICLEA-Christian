import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        message: string;
    }>;
}
