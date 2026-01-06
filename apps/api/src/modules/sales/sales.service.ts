import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { startDate, endDate, tutorId, page = 1, limit = 20 } = query || {};
    const where: any = { businessId };
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (tutorId) where.tutorId = tutorId;

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: { tutor: true, user: { select: { name: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sale.count({ where }),
    ]);
    return { data: sales, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, businessId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, businessId },
      include: { tutor: true, user: true, items: { include: { product: true } } },
    });
    if (!sale) throw new NotFoundException('Venda nao encontrada');
    return sale;
  }

  async create(businessId: string, userId: string, data: any) {
    const { items, ...saleData } = data;

    const subtotal = items.reduce((acc: number, item: any) => acc + Number(item.totalPrice), 0);
    const totalAmount = subtotal - (data.discount || 0);

    const sale = await this.prisma.sale.create({
      data: {
        ...saleData,
        businessId,
        userId,
        subtotal,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            totalPrice: item.totalPrice,
            itemType: item.itemType || 'PRODUCT',
          })),
        },
      },
      include: { items: true },
    });

    // Update stock for product items
    for (const item of items) {
      if (item.productId && item.itemType !== 'SERVICE') {
        const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
        if (product) {
          await this.prisma.$transaction([
            this.prisma.stockMovement.create({
              data: {
                productId: item.productId,
                type: 'SALE',
                quantity: item.quantity,
                previousStock: product.currentStock,
                newStock: Number(product.currentStock) - Number(item.quantity),
                saleId: sale.id,
              },
            }),
            this.prisma.product.update({
              where: { id: item.productId },
              data: { currentStock: { decrement: Number(item.quantity) } },
            }),
          ]);
        }
      }
    }

    // Update tutor total spent
    if (data.tutorId) {
      await this.prisma.tutor.update({
        where: { id: data.tutorId },
        data: { totalSpent: { increment: totalAmount }, lastVisitAt: new Date() },
      });
    }

    return sale;
  }
}
