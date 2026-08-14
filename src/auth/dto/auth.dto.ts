import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário.',
    example: 'solicitante@helpdesk.com'
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: 'senha123'
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password!: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Nome do usuário.',
    example: 'José da Silva'
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @ApiProperty({
    description: 'E-mail do usuário.',
    example: 'solicitante@helpdesk.com'
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: 'senha123'
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string;
}