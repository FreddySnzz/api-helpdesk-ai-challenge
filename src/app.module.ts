import { Module } from '@nestjs/common';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    TicketModule, 
    AuthModule, 
    PrismaModule, 
    AiAgentModule,
    MetricsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
