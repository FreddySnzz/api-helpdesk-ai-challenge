import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status, Priority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Status do chamado.',
    example: 'ABERTO, EM_ANDAMENTO, FECHADO, RESOLVIDO'
  })
  @IsOptional()
  @IsEnum(Status, { message: 'Status inválido' })
  status?: Status;

  @ApiProperty({
    description: 'Id do usuário que irá atender o chamado.',
    example: '50f1507c-oo02-9h7h-h202-092a315eas12'
  })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiProperty({
    description: 'Prioridade do chamado.',
    example: 'ALTA, MEDIA, BAIXA'
  })
  @IsOptional()
  @IsEnum(Priority, { message: 'Prioridade inválida' })
  priority?: Priority;
  
  @ApiProperty({
    description: 'Categoria do chamado.',
    example: 'Hardware, Software, Dúvidas, Outros'
  })
  @IsOptional()
  @IsString()
  category?: string;
}