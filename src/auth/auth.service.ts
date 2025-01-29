import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './../users/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    let userUpdate = await this.usersService.updateUserToken(user.id, token);

    delete userUpdate.password;
    return {
      user: userUpdate,
    };
  }

  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return plainToInstance(UserDto, result);
    }
    return null;
  }
  async verifyToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token); // Verifica formato y expiración
  
      // Busca el usuario por el ID que está en el payload del token
      const user = await this.usersService.findOne(payload.sub); // payload.sub contiene el userId
  
      if (!user || user.token !== token) { // Verifica si el token coincide con el token almacenado en la base de datos
        throw new UnauthorizedException('Token inválido o expirado');
      }
  
      return payload; // Si todo está bien, retorna el payload
    } catch (error) {
      console.log('error error auth service',error)
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async findUserById(userId: string): Promise<UserDto | null> {
    const user = await this.usersService.findOne(userId); // Asumo que tienes un método findOne en UsersService
    if (!user) {
      return null;
    }
    return plainToInstance(UserDto, user); // Transforma a UserDto
  }
}