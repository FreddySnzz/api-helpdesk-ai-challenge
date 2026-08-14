import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';
import { Status, Role } from '@prisma/client';
import { TicketService } from '../ticket.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AiAgentService } from '../../ai-agent/ai-agent.service';

describe('TicketService', () => {
  let service: TicketService;

  const mockPrisma = {
    ticket: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  const mockAiAgent = { classifyTicket: jest.fn() };
  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiAgentService, useValue: mockAiAgent },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Deve lançar um BadRequestException ao tentar atualizar um chamado FECHADO', async () => {
    const adminUser = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ticketId = 'ticket-123';

    mockPrisma.ticket.findUnique.mockResolvedValue({
      id: ticketId,
      status: Status.FECHADO,
      authorId: 'user-xyz',
    });

    await expect(
      service.update(
        ticketId, 
        { status: Status.EM_ANDAMENTO }, 
        adminUser
      )
    ).rejects.toThrow(BadRequestException);
    
    await expect(
      service.update(
        ticketId, 
        { status: Status.EM_ANDAMENTO }, 
        adminUser
      )
    ).rejects.toThrow('Não é possível alterar um chamado que já foi fechado');
  });
});