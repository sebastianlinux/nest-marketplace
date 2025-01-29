import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { isNumberString } from 'class-validator';

export interface ProductResponse {
  products: CreateProductDto[];
  totalCount: number; // Si también estás devolviendo un recuento total
  minPrice: Decimal,
  maxPrice: Decimal
}
@Injectable()


export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    try {
      const { price, ...rest } = createProductDto;
      const priceDecimal = new Decimal(price);
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
      if (error.code === 'P2002') {
        throw new ConflictException('El SKU ya existe. Por favor, elige un SKU diferente.'); // Usa ConflictException (409)
      } else if (error instanceof BadRequestException) { // Captura BadRequestException
        throw error; // Re-lanza la excepción para que se maneje en el controlador
      }
      console.error("Error al crear el producto:", error);
      throw new Error('Error al crear el producto.'); // Lanza un error genérico (500)
    }
  }
  
  async findAllProducts(userId: string, page:string,minPrice:string,maxPrice:string,productName?: string): Promise<ProductResponse> {
    try {
      const take = 4
      let skip = (parseInt(page) - 1) * take;
        skip = skip < 0 ? 0 : skip;
      const whereFilter: any = {  }; 
      const whereAggregate:any = {}
      if(userId && userId.length>0){
        whereFilter.user = { id: userId };
        whereAggregate.user = { id: userId };
      }
      if (productName && productName.length > 0) {
        whereFilter.name = {
          contains: productName, 
        };
      }

    
    if (minPrice && maxPrice && !isNaN(Number(minPrice)) && !isNaN(Number(maxPrice))) {
      const min = Number(minPrice);
      const max = Number(maxPrice);

      whereFilter.price = {
        gte: min, // Mayor o igual que el precio mínimo
        lte: max, // Menor o igual que el precio máximo
      };
    }
   
 
      const [products,totalCount,priceRange ]= await this.prisma.$transaction([
        this.prisma.product.findMany({
         where:whereFilter,
         orderBy: {
           createdAt: 'desc'
         },
         take,
         skip,
         include: { 
           user: true,
         }}),
         this.prisma.product.count({
          where:whereFilter,
        }),
        
        this.prisma.product.aggregate({ 
          where: whereAggregate,
          _min: { price: true },
          _max: { price: true },
        }),
      ])
      //return products.map(product => plainToInstance(CreateProductDto, {...product, price: (product.price.toString())}));


      const pages = Math.ceil(totalCount / take);

      const productDtos = products.map((product) =>
        plainToInstance(CreateProductDto, {
          ...product,
          price: product.price.toString(),
        }),
      );
      return { products: productDtos,
         totalCount: pages,
         minPrice: priceRange._min.price, 
         maxPrice: priceRange._max.price, };  

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