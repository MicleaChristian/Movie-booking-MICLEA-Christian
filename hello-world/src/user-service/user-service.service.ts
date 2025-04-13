import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserServiceService {
  async register(userData: { email: string; password: string; username: string }): Promise<any> {
    const { email, password, username } = userData;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Save the user to the database
    const user = {
      email,
      username,
      password: hashedPassword,
      // Simulated database ID
      id: Date.now(),
    };

    return { message: 'User registered successfully', user };
  }

  async login(loginData: { email: string; password: string }): Promise<any> {
    const { email, password } = loginData;

    // TODO: Retrieve user from the database
    const user = {
      email,
      username: 'demoUser',
      password: await bcrypt.hash('password123', 10), // Simulate stored hash
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
}
