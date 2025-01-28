import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {} // Inyecta PrismaService

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      return plainToInstance(UserEntity, user);
    } catch (error: any) { // Tipar el error como any
      if (error.code === 'P2002') {
        // Manejar la violación de restricción única (correo electrónico duplicado)
        throw new ConflictException('El correo electrónico ya se encuentra registrado.');
      } else if (error.code === 'P2003'){
        throw new ConflictException('Datos inconsistentes')
      }else if (error.code === 'P2014'){
        throw new ConflictException('Relacion no encontrada')
      }else if (error.code === 'P2025'){
        throw new ConflictException('Registro no encontrado')
      }
      else {
        // Manejar otros errores de Prisma o errores inesperados
        console.error("Error creating user:", error); // Log para depuración
        throw new InternalServerErrorException('Error interno del servidor al crear el usuario.'); // Mensaje genérico para el frontend
      }
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return plainToInstance(UserEntity, users);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(UserEntity, user);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return plainToInstance(UserEntity, updatedUser);
    } catch (error) {
       if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateUserToken(userId: string, token: string): Promise<UserEntity> {
    try {
      const updatedUser: User | null = await this.prisma.user.update({
        where: { id: userId },
        data: { token },
      });

      if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
      }
      return plainToInstance(UserEntity, updatedUser);
    } catch (error) {
      console.error(`Error al actualizar el token del usuario con ID ${userId}:`, error);

        if (error.code === 'P2025') {
            throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`)
        }

      throw new InternalServerErrorException('Error interno del servidor al actualizar el token del usuario.');
    }
  }
  async remove(id: string): Promise<UserEntity> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      return plainToInstance(UserEntity, deletedUser);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
}