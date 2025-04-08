export declare class UserServiceService {
    register(userData: {
        email: string;
        password: string;
        username: string;
    }): Promise<any>;
    login(loginData: {
        email: string;
        password: string;
    }): Promise<any>;
}
