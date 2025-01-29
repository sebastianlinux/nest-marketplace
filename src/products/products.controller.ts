import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Request,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Request as ExpressRequest } from 'express';
import { ProductDto } from './dto/product.dto';
import { diskStorage } from 'multer';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

interface RequestWithUser extends ExpressRequest {
  user: { id: string };
}

@ApiTags('Products') // Agrega un tag para agrupar los endpoints en la documentación de Swagger
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //create
  @Post()
  @ApiOperation({ summary: 'Create a new product' }) // Descripción del endpoint en Swagger
  @ApiConsumes('multipart/form-data') // Indica que el endpoint consume datos de formulario (para la carga de archivos)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        photoUrl: { type: 'string', format: 'binary' }, // Indica que photoUrl es un archivo
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createProductDto: Omit<CreateProductDto, 'photoUrl'>,
    @Request() req: RequestWithUser,
  ): Promise<ProductDto> {
    const product = { ...createProductDto, photoUrl: file.path };
    return this.productsService.create(product);
  }

 
  @Get('')
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: 'Returns a list of products.', type: [ProductDto] }) // Respuesta exitosa 200 con un array de ProductDto
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid query parameters.' }) // Respuesta 400
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Missing or invalid token.' }) // Respuesta 401
  findAllProducts(
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('productName') productName?: string,
  ) {
    return this.productsService.findAllProducts(userId,page,minPrice,maxPrice,productName);
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  } */

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({ type: CreateProductDto }) // Especifica el DTO para el body
  @ApiOkResponse({ description: 'The product has been successfully updated.', type: ProductDto }) // Respuesta 200
  @ApiNotFoundResponse({ description: 'Product not found.' }) // Respuesta 404
  @ApiBadRequestResponse({ description: 'Bad Request. Validation errors or incorrect input.' }) // Respuesta 400
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Missing or invalid token.' }) // Respuesta 401
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiOkResponse({ description: 'The product has been successfully deleted.' }) // Respuesta 200
  @ApiNotFoundResponse({ description: 'Product not found.' }) // Respuesta 404
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Missing or invalid token.' }) // Respuesta 401
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
