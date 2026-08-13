import { Comment } from "@prisma/client";

export class ReturnCommentDto {
  id: string;
  text: string;
  ticketId: string;
  authorId: string;
  createdAt: Date;

  constructor (comment: Comment) {
    this.id = comment.id;
    this.text = comment.text;
    this.ticketId = comment.ticketId;
    this.authorId = comment.authorId;
    this.createdAt = comment.createdAt;
  }
}