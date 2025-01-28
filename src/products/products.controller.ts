import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,
   UploadedFile, ParseFilePipe, MaxFileSizeValidator, Request, FileTypeValidator } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Request as ExpressRequest } from 'express';
import { ProductDto } from './dto/product.dto';
import { diskStorage } from 'multer';

interface RequestWithUser extends ExpressRequest {
  user: { id: string}
} 
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @UseInterceptors(FileInterceptor('photoUrl', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
  }))
  async create(
    @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
            new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
    })) file: Express.Multer.File,
    @Body() createProductDto: Omit<CreateProductDto, 'photoUrl'>,
      @Request() req: RequestWithUser
  ): Promise<ProductDto> {
      const product = {...createProductDto, photoUrl: file.path}
    return this.productsService.create(product);
  }


 /*  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  } */
  
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
 