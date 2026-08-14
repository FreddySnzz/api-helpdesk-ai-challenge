import { Test, TestingModule } from '@nestjs/testing';
import { Priority } from '@prisma/client';
import { AiAgentService } from '../ai-agent.service';

describe('AiAgentService', () => {
  let service: AiAgentService;

  beforeEach(async () => {
    delete process.env.GEMINI_API_KEY;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AiAgentService],
    }).compile();

    service = module.get<AiAgentService>(AiAgentService);
  });

  it('Deve classificar como ALTA prioridade e Hardware/Crítico se a descrição contiver "quebrou"', async () => {
    const result = await service.classifyTicket(
      'Problema físico',
      'Meu monitor caiu e quebrou a tela.'
    );

    expect(result.priority).toBe(Priority.ALTA);
    expect(result.category).toBe('Hardware/Crítico');
  });

  it('Deve classificar como MEDIA prioridade e Acessos se a descrição contiver "senha"', async () => {
    const result = await service.classifyTicket(
      'Acesso negado',
      'Esqueci minha senha do e-mail corporativo.'
    );

    expect(result.priority).toBe(Priority.MEDIA);
    expect(result.category).toBe('Acessos');
  });

  it('Deve classificar como BAIXA prioridade para assuntos genéricos', async () => {
    const result = await service.classifyTicket(
      'Dúvida de RH',
      'Gostaria de saber quando cai a primeira parcela do décimo terceiro.'
    );

    expect(result.priority).toBe(Priority.BAIXA);
    expect(result.category).toBe('Dúvidas/Geral');
  });
});