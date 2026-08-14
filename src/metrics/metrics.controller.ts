import { 
  Controller, 
  Sse, 
  Get, 
  UseGuards
} from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('metrics')
export class MetricsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private metricsService: MetricsService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Retorna os dados do dashboard',
    description: 'Retorna os dados do dashboard com o status dos chamados. Ordernados por status e prioridade.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do dashboard encontrados e retornados com sucesso.'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  async getInitialMetrics() {
    return this.metricsService.getDashboardData();
  }

  @Sse('stream')
  @ApiOperation({ 
    summary: 'Steam em tempo real de alertas',
    description: `Mantém uma conexão aberta para receber atualizações contínuas do servidor.
      \nEmite um objeto contendo a propriedade *data*, que é composta por três informações principais:
      \n**metrics**: O resultado de uma consulta ao banco/serviço, trazendo os dados atualizados do dashboard de métricas.
      \n**alert**: Um texto de alerta urgente apenas se a ação do evento for 'CREATED' (criação) e a prioridade do chamado for 'ALTA'. 
      Se não atender a esses dois requisitos (por exemplo, se for uma edição ou uma prioridade 'BAIXA'), esse campo retorna null.
      \n**lastTicket**: O objeto completo do chamado (ticket) que acabou de ser criado ou alterado e que disparou o evento.`
  })
  @ApiOkResponse({ 
    description: 'Fluxo de dados transmitido com sucesso.',
    content: {
      'text/event-stream': {
        schema: {
          type: 'string',
        },
        example: {
          "data": {
            "metrics": {
              "totalTickets": "number",
              "openTickets": "number",
              "resolvedTickets": "number",
            },
            "alert": "URGENTE: Novo chamado de ALTA prioridade criado: \"string\"",
            "lastTicket": {
              "id": "string",
              "title": "string",
              "priority": "ALTA",
              "status": "ABERTO",
            }
          }
        }
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado (Token inválido).' 
  })
  stream(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ticket.changed')
    .pipe(mergeMap(async (payload: any) => {
      const metrics = await this.metricsService.getDashboardData();
      const isHighPriorityAlert = payload.action === 'CREATED' && payload.ticket.priority === 'ALTA';

      return {
        data: {
          metrics,
          alert: isHighPriorityAlert 
            ? `URGENTE: Novo chamado de ALTA prioridade criado: "${payload.ticket.title}"` 
            : null,
          lastTicket: payload.ticket,
        },
      } as MessageEvent;
    }),
    )
  }
}