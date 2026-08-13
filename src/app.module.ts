import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    UserModule, 
    TicketModule, 
    AuthModule, 
    PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
