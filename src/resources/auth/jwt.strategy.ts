import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET_KEY } from '../../shared/utils/constant';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: ACCESS_TOKEN_SECRET_KEY,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.authService.checkExistUser(payload.email);
    if (!user) {
      throw new Error('Invalid token');
    }
    return user;
  }
}
