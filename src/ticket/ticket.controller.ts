import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Status } from '@prisma/client';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TicketService } from './ticket.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReturnTicketDto } from './dto/return-ticket.dto';
import { ReturnCommentDto } from './dto/return-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketsService: TicketService
  ) {}

  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ 
    summary: 'Cria um novo chamado', 
    description: 'A IA fará a triagem automática baseada na descrição.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Chamado criado e triado com sucesso.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async create(
    @CurrentUser() user: User, 
    @Body() createTicketDto: CreateTicketDto
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.create(user.id, createTicketDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Retorna todos os chamados',
    description: 'Retorna todos os chamados com status informado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chamados encontrados e retornados com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async findAll(
    @CurrentUser() user: User, 
    @Query('status') status?: Status
  ): Promise<ReturnTicketDto[]> {
    return this.ticketsService.findAll(user, status);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Retorna um chamado específico',
    description: 'Retorna o chamado informado e seus comentários.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chamado encontrado e retornado com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async findOne(
    @Param('id') id: string, 
    @CurrentUser() user: User
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualiza as informações do chamado',
    description: 'Atualiza o status, prioridade, categoria ou define o responsável pelo chamado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chamado atualizado com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async update(
    @Param('id') id: string, 
    @Body() updateTicketDto: UpdateTicketDto, 
    @CurrentUser() user: User
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Deleta um chamado',
    description: 'Deleta o chamado informado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chamado deletado com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async remove(
    @Param('id') id: string, 
    @CurrentUser() user: User
  ): Promise<void> {
    return this.ticketsService.remove(id, user);
  }

  @Post(':id/comments')
  @ApiOperation({ 
    summary: 'Cria um novo comentário no chamado',
    description: 'Adiciona um comentário no chamado informado.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Comentário criado com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async addComment(
    @Param('id') ticketId: string,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<ReturnCommentDto> {
    return this.ticketsService.addComment(ticketId, user.id, createCommentDto, user);
  }
}