import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [UserModule, TicketModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
