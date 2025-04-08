import { RegisterDto, LoginDto } from './user-controller.dto';
export declare class UserControllerController {
    register(registerDto: RegisterDto): string;
    login(loginDto: LoginDto): string;
}
