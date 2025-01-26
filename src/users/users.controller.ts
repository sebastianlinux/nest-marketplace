import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBadRequestResponse, ApiNotFoundResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';


@ApiTags('users') // Agrupa las rutas bajo la etiqueta "users" en Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente', type: UserEntity })
  @ApiBadRequestResponse({ description: 'Solicitud inválida' })
  @ApiBody({ type: CreateUserDto, description: 'Datos para crear un nuevo usuario' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de usuarios obtenida exitosamente', type: [UserEntity] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Usuario encontrado', type: UserEntity })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del usuario', format: 'uuid' }) // Documenta el parámetro id
  findOne(@Param('id', ParseUUIDPipe) id: string) { // Usa ParseUUIDPipe para validar el UUID
    //return this.usersService.findOne(id); // no es necesario convertir a numero
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Usuario actualizado exitosamente', type: UserEntity })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'Solicitud inválida' })
  @ApiParam({ name: 'id', description: 'ID del usuario', format: 'uuid' }) // Documenta el parámetro id
  @ApiBody({ type: UpdateUserDto, description: 'Datos para actualizar el usuario' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    //return this.usersService.update(id, updateUserDto); // no es necesario convertir a numero
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Usuario eliminado exitosamente', type: UserEntity })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del usuario', format: 'uuid' }) // Documenta el parámetro id
  remove(@Param('id', ParseUUIDPipe) id: string) { // Usa ParseUUIDPipe para validar el UUID
    //return this.usersService.remove(id); // no es necesario convertir a numero
  }
}