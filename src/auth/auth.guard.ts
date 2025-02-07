import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../users/users.entity'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token manquant');

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fallbackSecret',
      });
      request.user = payload as User;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }

    return true;
  }
}
