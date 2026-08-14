import { 
  Controller, 
  Post, 
  Body, 
  UsePipes, 
  ValidationPipe, 
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ReturnLoginDto, ReturnRegisterDto } from './dto/return-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Autentica o usuário',
    description: 'Autentica o usuário com e-mail e senha.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Autenticado com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (E-mail ou senha inválidos).' 
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: LoginDto
  ): Promise<ReturnLoginDto> {
    return this.authService.login(data);
  }

  @UsePipes(ValidationPipe)
  @Post('register')
  @ApiOperation({ 
    summary: 'Cria um novo usuário',
    description: 'Cria um novo usuário com e-mail e senha.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (E-mail ou senha inválidos).' 
  })
  async register(
    @Body() data: RegisterDto
  ): Promise<ReturnRegisterDto> {
    return this.authService.register(data);
  }
}