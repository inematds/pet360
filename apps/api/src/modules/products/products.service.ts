import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { search, category, page = 1, limit = 20 } = query || {};
    const where: any = { businessId, isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search } },
        { barcode: { contains: search } },
      ];
    }
    if (category) where.category = category;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);
    return { data: products, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, businessId: string) {
    const product = await this.prisma.product.findFirst({ where: { id, businessId } });
    if (!product) throw new NotFoundException('Produto nao encontrado');
    return product;
  }

  async create(businessId: string, data: any) {
    return this.prisma.product.create({ data: { ...data, businessId } });
  }

  async update(id: string, businessId: string, data: any) {
    await this.findOne(id, businessId);
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string, businessId: string) {
    await this.findOne(id, businessId);
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async getLowStock(businessId: string) {
    return this.prisma.product.findMany({
      where: { businessId, isActive: true, currentStock: { lte: this.prisma.product.fields.minStock } },
    });
  }

  async getExpiring(businessId: string, days: number = 30) {
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.prisma.product.findMany({
      where: { businessId, isActive: true, expirationDate: { lte: futureDate } },
      orderBy: { expirationDate: 'asc' },
    });
  }

  async addStockMovement(productId: string, data: any) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produto nao encontrado');

    const previousStock = Number(product.currentStock);
    let newStock = previousStock;

    switch (data.type) {
      case 'PURCHASE':
      case 'RETURN':
      case 'ADJUSTMENT':
        newStock = previousStock + Number(data.quantity);
        break;
      case 'SALE':
      case 'SERVICE_USE':
      case 'LOSS':
      case 'EXPIRED':
        newStock = previousStock - Number(data.quantity);
        break;
    }

    await this.prisma.$transaction([
      this.prisma.stockMovement.create({
        data: { ...data, productId, previousStock, newStock },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: { currentStock: newStock },
      }),
    ]);

    return { previousStock, newStock };
  }
}
