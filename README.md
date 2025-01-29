 
## Description
Nestjs Api marketplace magicloc
## Installation

```bash
$ npm install
```

## Running the app

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

## test

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

 
## Tabla de Contenidos
Este proyecto es una API RESTful construida con NestJS y Prisma ORM. Proporciona funcionalidades para [describe las funcionalidades principales de tu API].


Introducción
Tecnologías
Instalación
Configuración
Comandos
Estructura del Proyecto
Documentación de la API
Servicios
Módulos
Rutas
Controladores
Entidades y DTOs
Migraciones de la Base de Datos
Pruebas
Despliegue
Contribución
Licencia
 
### NestJS Prisma API
Este proyecto es una API RESTful construida con NestJS y Prisma ORM. Proporciona funcionalidades para [describe las funcionalidades principales de tu API].

### Tabla de Contenidos
Introducción
Tecnologías
Instalación
Configuración
Comandos
Estructura del Proyecto
Documentación de la API
Servicios
Módulos
Rutas
Controladores
Entidades y DTOs
Migraciones de la Base de Datos
Pruebas
Despliegue
Contribución
Licencia
### 1. Introducción
Breve descripción del propósito de la API y las funcionalidades que ofrece.

### 2. Tecnologías
NestJS
Prisma ORM
Node.js
TypeScript
Express
[Otras tecnologías utilizadas]
###  3. Instalación
Clona el repositorio:



git clone https://github.com/sebastianlinux/nest-marketplace
Instala las dependencias:



npm install
###  4. Configuración

Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias. Puedes usar el archivo .env.example 1  como plantilla.   
1.
github.com
github.com
DATABASE_URL="mysql://user:password@IP.amazonaws.com:3306/database"
JWT_SECRET="[Clave secreta para JWT]"
# [Otras variables de entorno]

Configura la base de datos con Prisma:

Bash

npx prisma generate
###  5. Comandos
Desarrollo:

Bash

npm run start:dev
Producción:

Bash

npm run start:prod
Pruebas:

Bash

npm run test
Pruebas unitarias:

Bash

npm run test:unit
Pruebas de integración:

Bash

npm run test:e2e
Migraciones de la base de datos:

Bash

npx prisma migrate dev --name [nombre-de-la-migracion]
Generar el cliente de Prisma:

Bash

npx prisma generate
Documentación de la API (Swagger):

Bash

npm run start:dev # Inicia el servidor de desarrollo
# Luego, accede a la documentación en http://localhost:3000/api
###  6. Estructura del Proyecto
src/
├── app.module.ts        # Módulo principal de la aplicación
├── app.controller.ts    # Controlador principal de la aplicación
├── app.service.ts       # Servicio principal de la aplicación
├── auth/                # Módulo de autenticación
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── auth.middleware.ts
│   └── jwt.strategy.ts
├── users/               # Módulo de usuarios
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       └── create-user.dto.ts
├── products/            # Módulo de productos
│   ├── products.module.ts
│   ├── products.service.ts
│   ├── products.controller.ts
│   └── ...
├── prisma.service.ts    # Servicio de Prisma
├── main.ts              # Archivo principal de la aplicación
├── ...
test/                    # Pruebas
├── app.e2e-spec.ts
└── app.e2e.ts
.env                    # Archivo de entorno
.env.example            # Plantilla de archivo de entorno
prisma/                 # Archivos de Prisma
├── schema.prisma
└── migrations/
package.json
tsconfig.json
README.md
###  7. Documentación de la API
La API está documentada con Swagger. Para acceder a la documentación, ejecuta el servidor de desarrollo (npm run start:dev) y navega a http://localhost:3000/api.

###  8. Servicios
### users.service

   * Este servicio gestiona las operaciones relacionadas con los usuarios. 
   * Incluye métodos para crear nuevos usuarios (hasheando la contraseña y manejando errores de correo electrónico duplicado)
   * obtener todos los usuarios, obtener un usuario por ID o correo electrónico, 
   * actualizar la información de un usuario, actualizar el token de un usuario y eliminar un usuario.
   * Utiliza Prisma Service para interactuar con la base de datos y class-transformer para convertir 
   * los resultados de Prisma a entidades de usuario.
   
###  products.service 

El servicio ProductsService gestiona las operaciones relacionadas con los productos en la base de datos utilizando Prisma.  Incluye métodos para crear nuevos productos (validando el precio y manejando errores de SKU duplicado), obtener todos los productos (con opciones de filtrado por usuario, página, rango de precios y nombre), obtener un producto por ID, actualizar la información de un producto y eliminar un producto.  Los resultados de Prisma se convierten a DTOs usando class-transformer. Se manejan excepciones como ConflictException para SKUs duplicados, BadRequestException para precios inválidos, y NotFoundException para productos no encontrados.  También se capturan y loguean errores inesperados, lanzando un error genérico del servidor.

### auth.service
El servicio AuthService gestiona la lógica de autenticación de la aplicación.  Incluye métodos para el inicio de sesión de usuario (verificando credenciales y generando tokens JWT), validación de usuarios (para estrategias de autenticación), verificación de tokens JWT (comprobando formato, expiración y la coincidencia con el token almacenado en la base de datos) y búsqueda de usuarios por ID.  Utiliza UsersService para interactuar con la base de datos y JwtService para la generación y verificación de tokens.  También utiliza bcrypt para comparar contraseñas hasheadas.

###  9. Módulos
### auth.module
El módulo AuthModule encapsula la funcionalidad de autenticación de la aplicación.  Importa UsersModule para acceder a los servicios de usuario, PassportModule para la integración con Passport.js, y JwtModule para la gestión de tokens JWT (configurado con una clave secreta y una duración de expiración).  Declara AuthController para los endpoints de autenticación, y provee AuthService y JwtStrategy (la estrategia de autenticación JWT).  Finalmente, exporta AuthService para que pueda ser utilizado por otros módulos.

### users.module
2.0 Flash Experimental. Podría no funcionar como se espera.
El módulo UsersModule encapsula la lógica y componentes relacionados con la gestión de usuarios.  Declara UsersController para los endpoints de usuario, provee UsersService para la lógica de negocio y PrismaService para la interacción con la base de datos.  Exporta UsersService para que pueda ser utilizado por otros módulos que necesiten acceder a la funcionalidad de usuario.
### products.module
l módulo ProductsModule gestiona la funcionalidad relacionada con los productos.  Importa AuthModule para la autenticación, MulterModule para la gestión de uploads de archivos (configurado con almacenamiento en disco, filtro de tipos de archivo y límites de tamaño), y UsersModule para acceder a la información de los usuarios.  Declara ProductsController para los endpoints de productos y provee ProductsService y PrismaService.  Implementa el middleware AuthMiddleware para proteger todas las rutas de /products, requiriendo autenticación JWT.  También configura JwtModule con las opciones necesarias.

###  10. Rutas
https://nest-marketplace.onrender.com/users 
https://nest-marketplace.onrender.com/products
https://nest-marketplace.onrender.com/auth 

###  11. Controladores
### AppController: 
Maneja las rutas principales de la aplicación.
#### AuthController: 
Gestiona la autenticación de usuarios (login, registro, etc.).
### UsersController: 
Expone endpoints para la gestión de usuarios (creación, lectura, actualización, eliminación).
### ProductsController: 
Ofrece endpoints para la gestión de productos (creación, lectura, actualización, eliminación, búsqueda, etc.).
###  12. Entidades y DTOs
UserEntity, loginDto,productDto,createUserDto,updateUserDto,createProductDto,updateProductDto

###  13. Migraciones de la Base de Datos
ejectar el comando: npm prisma migrate dev --name init
Esta base de datos almacena información esencial para un marketplace en línea, incluyendo:
Usuarios: Detalles de los usuarios registrados (nombre, correo electrónico, contraseña, etc.).
Productos: Información de los productos ofrecidos (nombre, descripción, precio, imágenes, etc.).
La base de datos está diseñada para ser eficiente y escalable, permitiendo el crecimiento del marketplace y la adición de nuevas funcionalidades en el futuro.

###  14. Pruebas
Pruebas unitarias a realizar: login, registro, crearProduct, listProduct,Paginacion, Busquedas.

###  15. Despliegue

desplegado en render https://nest-marketplace.onrender.com

