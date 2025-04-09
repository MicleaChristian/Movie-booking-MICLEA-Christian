import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // Replace with your JWT secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, UserService],
})
export class AuthModule {}
