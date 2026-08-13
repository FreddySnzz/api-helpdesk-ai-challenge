import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description!: string;
}