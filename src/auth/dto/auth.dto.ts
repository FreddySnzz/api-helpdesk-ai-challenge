import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string;
}