import { Priority, Status, Ticket } from "@prisma/client";

export class ReturnTicketDto {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  isAiClassified: boolean;
  authorId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor (ticket: Ticket) {
    this.id = ticket.id;
    this.title = ticket.title;
    this.description = ticket.description;
    this.category = ticket.category;
    this.priority = ticket.priority;
    this.status = ticket.status;
    this.isAiClassified = ticket.isAiClassified;
    this.authorId = ticket.authorId;
    this.assigneeId = ticket.assigneeId;
    this.createdAt = ticket.createdAt;
    this.updatedAt = ticket.updatedAt;
  }
}