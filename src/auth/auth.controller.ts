import { 
  Controller, 
  Post, 
  Body, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ReturnLoginDto, ReturnRegisterDto } from './dto/return-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(
    @Body() data: LoginDto
  ): Promise<ReturnLoginDto> {
    return this.authService.login(data);
  }

  @UsePipes(ValidationPipe)
  @Post('register')
  async register(
    @Body() data: RegisterDto
  ): Promise<ReturnRegisterDto> {
    return this.authService.register(data);
  }
}