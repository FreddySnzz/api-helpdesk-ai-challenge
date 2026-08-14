import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';

@Module({
  imports: [
    UserModule, 
    TicketModule, 
    AuthModule, 
    PrismaModule, 
    AiAgentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
