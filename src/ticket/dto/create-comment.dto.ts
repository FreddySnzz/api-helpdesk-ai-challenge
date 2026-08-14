import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Informações adicionais sobre o chamado.',
    example: 'Depois de algum tempo, a luz do teclado acendeu, mas o teclado não responde.'
  })
  @IsString()
  @IsNotEmpty({ message: 'O texto do comentário não pode ser vazio' })
  text!: string;
}