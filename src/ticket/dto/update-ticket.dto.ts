import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status, Priority } from '@prisma/client';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(Status, { message: 'Status inválido' })
  status?: Status;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsEnum(Priority, { message: 'Prioridade inválida' })
  priority?: Priority;
  
  @IsOptional()
  @IsString()
  category?: string;
}