"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let UserServiceService = class UserServiceService {
    async register(userData) {
        const { email, password, username } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            email,
            username,
            password: hashedPassword,
            id: Date.now(),
        };
        return { message: 'User registered successfully', user };
    }
    async login(loginData) {
        const { email, password } = loginData;
        const user = {
            email,
            username: 'demoUser',
            password: await bcrypt.hash('password123', 10),
            id: 1,
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ sub: user.id, email: user.email }, 'your_jwt_secret', {
            expiresIn: '1h',
        });
        return { access_token: token };
    }
};
exports.UserServiceService = UserServiceService;
exports.UserServiceService = UserServiceService = __decorate([
    (0, common_1.Injectable)()
], UserServiceService);
//# sourceMappingURL=user-service.service.js.map