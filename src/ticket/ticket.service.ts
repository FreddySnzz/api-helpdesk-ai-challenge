import { 
  Injectable, 
  ForbiddenException, 
  BadRequestException, 
  NotFoundException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Status, Role, User } from '@prisma/client';
import { ReturnTicketDto } from './dto/return-ticket.dto';
import { ReturnCommentDto } from './dto/return-comment.dto';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private aiAgentService: AiAgentService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(
    userId: string, 
    data: CreateTicketDto
  ): Promise<ReturnTicketDto> {
    const classification = await this.aiAgentService.classifyTicket(data.title, data.description);

    const ticket = await this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: userId,
        category: classification.category,
        priority: classification.priority,
        isAiClassified: classification.isAiClassified,
      },
    });

    this.eventEmitter.emit('ticket.changed', 
      { action: 'CREATED', ticket }
    );
    return ticket;
  }

  async findAll(
    user: User,
    status?: Status
  ): Promise<ReturnTicketDto[]> {
    const whereClause: any = {};

    if (user.role === Role.SOLICITANTE) whereClause.authorId = user.id;
    if (status) whereClause.status = status;

    return this.prisma.ticket.findMany({
      where: whereClause,
      include: { 
        author: { 
          select: { 
            name: true, 
            email: true 
          } 
        }, 
        assignee: { 
          select: { 
            name: true 
          } 
        } 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
    });
  }

  async findOne(
    id: string, 
    user: User
  ): Promise<ReturnTicketDto> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { 
        comments: { 
          include: { 
            author: { 
              select: { 
                name: true, 
                role: true 
              } 
            } 
          }, 
          orderBy: { 
            createdAt: 'asc' 
          } 
        },
        author: { 
          select: { 
            name: true, 
            email: true 
          } 
        }
      },
    });

    if (!ticket) throw new NotFoundException('Chamado não encontrado');

    if (user.role === Role.SOLICITANTE && ticket.authorId !== user.id) {
      throw new ForbiddenException('Você não tem acesso a este chamado');
    }

    return ticket;
  }

  async update(
    id: string, 
    updateData: UpdateTicketDto, 
    user: User
  ): Promise<ReturnTicketDto> {
    const ticket = await this.findOne(id, user);

    if (ticket.status === Status.FECHADO) {
      throw new BadRequestException('Não é possível alterar um chamado que já foi fechado');
    }

    if (user.role === Role.SOLICITANTE) {
      delete updateData.assigneeId;
      delete updateData.priority;
      delete updateData.category;
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: updateData,
    });

    this.eventEmitter.emit('ticket.changed', 
      { action: 'UPDATED', ticket: updatedTicket }
    );
    return updatedTicket;
  }

  async remove(
    id: string, 
    user: User
  ): Promise<void> {
    const ticket = await this.findOne(id, user);
    
    if (user.role === Role.SOLICITANTE && ticket.status !== Status.ABERTO) {
      throw new BadRequestException('Você só pode cancelar chamados que ainda estão ABERTOS');
    }

    await this.prisma.ticket.delete({ 
      where: { id } 
    });
  }

  async addComment(
    ticketId: string, 
    userId: string, 
    data: CreateCommentDto, 
    user: User
  ): Promise<ReturnCommentDto> {
    const ticket = await this.findOne(ticketId, user);

    if (ticket.status === Status.FECHADO) {
      throw new BadRequestException('Não é possível comentar em um chamado fechado');
    }

    return this.prisma.comment.create({
      data: {
        text: data.text,
        ticketId,
        authorId: userId,
      },
      include: { 
        author: { 
          select: { 
            name: true, 
            role: true 
          } 
        } 
      }
    });
  }
}