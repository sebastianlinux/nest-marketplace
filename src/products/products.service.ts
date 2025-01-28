import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { isNumberString } from 'class-validator';


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    try {
      const { price, ...rest } = createProductDto;
      const priceDecimal = new Decimal(price);
      console.log('proce ddecimal es',priceDecimal)
      if (!isNumberString(price)) {
        throw new BadRequestException('El precio debe ser un número válido.');
      }
      const product = await this.prisma.product.create({
        data: {
          ...rest,
          price: priceDecimal,
        },
      });
      const productDto = plainToInstance(ProductDto, {
        ...product,
        price: product.price.toString()
      });
      return plainToInstance(ProductDto, productDto);
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw error;
    }
  }

  async findAll(userId:string): Promise<CreateProductDto[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { userId },
      });
      return products.map(product => plainToInstance(CreateProductDto, {...product, price: (product.price.toString())}));
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<CreateProductDto | null> {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
      }
      return plainToInstance(CreateProductDto, product);
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, updateProductDto:UpdateProductDto): Promise<UpdateProductDto | null> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      return plainToInstance(UpdateProductDto, product);
    } catch (error) {
      console.error(`Error al actualizar el producto con ID ${id}:`, error);
        if (error.code === 'P2025') {
            throw new NotFoundException(`Producto con ID ${id} no encontrado.`)
        }
      throw error;
    }
  }

  async remove(id: string): Promise<CreateProductDto | null> {
    try {
      const product = await this.prisma.product.delete({ where: { id } });
      return plainToInstance(CreateProductDto, product);
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${id}:`, error);
        if (error.code === 'P2025') {
            throw new NotFoundException(`Producto con ID ${id} no encontrado.`)
        }
      throw error;
    }
  }
}