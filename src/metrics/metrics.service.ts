import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const byStatus = await this.prisma.ticket.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const byPriority = await this.prisma.ticket.groupBy({
      by: ['priority'],
      _count: { id: true },
    });

    return { byStatus, byPriority };
  }
}