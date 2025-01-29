// auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado o inválido');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.authService.verifyToken(token);
      const user = await this.authService.findUserById(payload.sub); // Usa payload.sub

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      (req as any).user = user; // Asigna el usuario a req.user
      next();
    } catch (error) {
      console.error('Error en AuthMiddleware:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}