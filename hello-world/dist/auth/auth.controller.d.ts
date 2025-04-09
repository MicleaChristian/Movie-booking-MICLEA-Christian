import { UserService } from '../user/user.service';
export declare class AuthController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<any>;
}
