import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Resumo do problema enfrentado.',
    example: 'Teclado parou de funcionar'
  })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title!: string;

  @ApiProperty({
    description: 'Descrição detalhada do erro ou solicitação. A IA usará este texto para triagem.',
    example: 'Quando ligo o computador, nenhuma luz acende no teclado e as teclas não respondem.'
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description!: string;
}