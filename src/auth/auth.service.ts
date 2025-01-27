import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './../users/dto/create-user.dto' // Importa el DTO
import { plainToInstance } from 'class-transformer';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) { // Recibe email y password directamente
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException('Credenciales incorrectas'); // Lanza excepción si las credenciales son inválidas
    }
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload); 
    let userUpdate = await this.usersService.updateUserToken(user.id, token);
    return {
      user: userUpdate
    };
  }
  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return plainToInstance(UserDto,result); // Transforma a UserDto antes de retornar
    }
    return null;
  }
}