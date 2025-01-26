import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: 'ID del usuario', example: 'cl869r59n000008j7f471k98' })
  id: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@ejemplo.com' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'admin', enum: ['admin', 'user', 'guest'] })
  role: string;

  @ApiProperty({ description: 'Estado del usuario', example: 'active', enum: ['active', 'inactive'] })
  status: string;

  @ApiProperty({ description: 'Fecha de creación del usuario', example: '2024-10-27T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del usuario', example: '2024-10-27T12:30:00.000Z' })
  updatedAt: Date;
}