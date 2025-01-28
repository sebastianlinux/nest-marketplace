import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  photoUrl: string;

  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsUUID() // Valida que sea un UUID
  @IsNotEmpty()
  userId: string; // Clave foránea para el usuario
}