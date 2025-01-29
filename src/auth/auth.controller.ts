import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'; // Elimina @Request y ExpressRequest
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // DTO para la solicitud de login
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';


@ApiTags('Authentication') // Agrupa los endpoints de autenticación en la documentación
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({  
    type: LoginDto, // Usa el DTO para definir la estructura del body
    examples: { 
        'application/json': {
          value: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
      },
  })
  @ApiOkResponse({ description: 'Successful login. Returns user information and access token.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. Invalid credentials.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Validation errors or missing required fields.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) { // Recibe las credenciales en el body
    return this.authService.login(loginDto.email, loginDto.password); // Pasa email y password
  }
}