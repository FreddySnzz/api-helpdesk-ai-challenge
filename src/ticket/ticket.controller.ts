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

@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketsService: TicketService
  ) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(
    @CurrentUser() user: User, 
    @Body() createTicketDto: CreateTicketDto
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.create(user.id, createTicketDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: User, 
    @Query('status') status?: Status
  ): Promise<ReturnTicketDto[]> {
    return this.ticketsService.findAll(user, status);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string, 
    @CurrentUser() user: User
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateTicketDto: UpdateTicketDto, 
    @CurrentUser() user: User
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string, 
    @CurrentUser() user: User
  ): Promise<ReturnTicketDto> {
    return this.ticketsService.remove(id, user);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') ticketId: string,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<ReturnCommentDto> {
    return this.ticketsService.addComment(ticketId, user.id, createCommentDto, user);
  }
}