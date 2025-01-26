import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@ejemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'contraseña123', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'admin', enum: ['admin', 'user', 'guest'] })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ description: 'Estado del usuario', example: 'active', enum: ['active', 'inactive'], default: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string; // El campo status es opcional en la creación, ya que tiene un valor por defecto en el esquema de Prisma
}