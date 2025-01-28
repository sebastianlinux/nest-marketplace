import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; 

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, AuthModule, ProductsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Ruta a la carpeta uploads (relativa a la raíz del proyecto)
      serveRoot: '/uploads', // Ruta URL para acceder a los archivos (ej: http://localhost:3000/uploads)
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
