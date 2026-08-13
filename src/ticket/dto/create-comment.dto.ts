import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'O texto do comentário não pode ser vazio' })
  text!: string;
}