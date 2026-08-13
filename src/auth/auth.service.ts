import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ReturnLoginDto, ReturnRegisterDto } from './dto/return-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(
    data: LoginDto
  ): Promise<ReturnLoginDto> {
    const user = await this.prisma.user.findUnique(
      { 
        where: { 
          email: data.email 
        } 
      }
    )

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await bcrypt.compare(
      data.password, 
      user.password
    );

    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    }
  }

  async register(
    data: RegisterDto
  ): Promise<ReturnRegisterDto> {
    const userExists = await this.prisma.user.findUnique(
      { 
        where: { 
          email: data.email 
        } 
      }
    )

    if (userExists) throw new BadRequestException('E-mail já cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    }
  }
}