import { 
  Controller, 
  Sse, 
  MessageEvent, 
  Get 
} from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private metricsService: MetricsService,
  ) {}

  @Get()
  async getInitialMetrics() {
    return this.metricsService.getDashboardData();
  }

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ticket.changed')
    .pipe(mergeMap(async (payload: any) => { // TODO: tipar o payload
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