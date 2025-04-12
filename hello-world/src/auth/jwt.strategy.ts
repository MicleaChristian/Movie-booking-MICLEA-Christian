import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your_jwt_secret',
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload); // Log the JWT payload
    return { 
      id: payload.sub, // Changed userId to id to match the User entity
      username: payload.username, 
      email: payload.email 
    };
  }
}
