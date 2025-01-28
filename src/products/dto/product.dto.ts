import { Transform } from 'class-transformer';

export class ProductDto {
  id: string;
  sku: string;
  name: string;
  description: string;
  photoUrl: string;
  price: string;
  status: string;
    createdAt: Date;
    updatedAt: Date;
}
 