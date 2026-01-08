import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  // ========== SELLERS ==========

  async registerSeller(data: any) {
    const existing = await this.prisma.marketplaceSeller.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email ja cadastrado');

    return this.prisma.marketplaceSeller.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpfCnpj: data.cpfCnpj,
        companyName: data.companyName,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        sellerType: data.sellerType,
      },
    });
  }

  async getSeller(id: string) {
    const seller = await this.prisma.marketplaceSeller.findUnique({
      where: { id },
      include: {
        listings: { where: { status: 'ACTIVE' }, take: 10 },
        _count: { select: { listings: true, orders: true, reviews: true } },
      },
    });

    if (!seller) throw new NotFoundException('Vendedor nao encontrado');
    return seller;
  }

  async updateSeller(id: string, data: any) {
    return this.prisma.marketplaceSeller.update({ where: { id }, data });
  }

  // ========== CATEGORIES ==========

  async getCategories() {
    return this.prisma.marketplaceCategory.findMany({
      where: { isActive: true, parentId: null },
      include: { children: { where: { isActive: true } } },
      orderBy: { order: 'asc' },
    });
  }

  async createCategory(data: any) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.marketplaceCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId: data.parentId,
        order: data.order,
      },
    });
  }

  // ========== LISTINGS ==========

  async createListing(sellerId: string, data: any) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return this.prisma.marketplaceListing.create({
      data: {
        sellerId,
        categoryId: data.categoryId,
        title: data.title,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        brand: data.brand,
        sku: data.sku,
        barcode: data.barcode,
        forSpecies: data.forSpecies,
        forSizes: data.forSizes,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        costPrice: data.costPrice,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        weight: data.weight,
        dimensions: data.dimensions,
        images: data.images,
        videoUrl: data.videoUrl,
        tags: data.tags,
        attributes: data.attributes,
        nutritionInfo: data.nutritionInfo,
        ingredients: data.ingredients,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        shippingType: data.shippingType,
        freeShipping: data.freeShipping,
        shippingPrice: data.shippingPrice,
        status: 'DRAFT',
      },
    });
  }

  async getListings(query: {
    categoryId?: string;
    sellerId?: string;
    species?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    freeShipping?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, sellerId, species, size, minPrice, maxPrice, search, freeShipping, sortBy } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const where: Prisma.MarketplaceListingWhereInput = { status: 'ACTIVE' };

    if (categoryId) where.categoryId = categoryId;
    if (sellerId) where.sellerId = sellerId;
    if (species) where.forSpecies = { has: species as any };
    if (size) where.forSizes = { has: size as any };
    if (freeShipping) where.freeShipping = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'rating') orderBy = { averageRating: 'desc' };
    if (sortBy === 'sales') orderBy = { salesCount: 'desc' };

    const [listings, total] = await Promise.all([
      this.prisma.marketplaceListing.findMany({
        where,
        include: { seller: { select: { id: true, name: true, averageRating: true } }, category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.marketplaceListing.count({ where }),
    ]);

    return { listings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getListing(id: string) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true, city: true, state: true, averageRating: true, totalReviews: true } },
        category: true,
        reviews: { where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!listing) throw new NotFoundException('Produto nao encontrado');

    // Increment view count
    await this.prisma.marketplaceListing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async updateListing(id: string, data: any) {
    return this.prisma.marketplaceListing.update({ where: { id }, data });
  }

  async publishListing(id: string) {
    return this.prisma.marketplaceListing.update({
      where: { id },
      data: { status: 'PENDING_REVIEW', publishedAt: new Date() },
    });
  }

  async approveListing(id: string) {
    return this.prisma.marketplaceListing.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async rejectListing(id: string, reason: string) {
    return this.prisma.marketplaceListing.update({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: reason },
    });
  }

  async deleteListing(id: string) {
    return this.prisma.marketplaceListing.delete({ where: { id } });
  }

  // ========== ORDERS ==========

  async createOrder(data: any) {
    const items = data.items as { listingId: string; quantity: number }[];

    // Validate and get listings
    const listings = await this.prisma.marketplaceListing.findMany({
      where: { id: { in: items.map((i) => i.listingId) } },
      include: { seller: true },
    });

    if (listings.length !== items.length) {
      throw new BadRequestException('Alguns produtos nao foram encontrados');
    }

    // Check stock
    for (const item of items) {
      const listing = listings.find((l) => l.id === item.listingId);
      if (!listing || listing.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para ${listing?.title}`);
      }
    }

    // Group by seller (create separate orders if multiple sellers)
    const sellerId = listings[0].sellerId;
    const seller = listings[0].seller;

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const listing = listings.find((l) => l.id === item.listingId)!;
      const totalPrice = Number(listing.price) * item.quantity;
      subtotal += totalPrice;
      return {
        listingId: listing.id,
        title: listing.title,
        sku: listing.sku,
        quantity: item.quantity,
        unitPrice: listing.price,
        totalPrice,
      };
    });

    const shippingCost = data.shippingCost || 0;
    const discount = data.discount || 0;
    const totalAmount = subtotal + shippingCost - discount;
    const commission = totalAmount * (Number(seller.commissionRate) / 100);
    const sellerPayout = totalAmount - commission;

    // Generate order number
    const orderNumber = `MP${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await this.prisma.marketplaceOrder.create({
      data: {
        sellerId,
        orderNumber,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        buyerCpf: data.buyerCpf,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingZipCode: data.shippingZipCode,
        subtotal,
        shippingCost,
        discount,
        totalAmount,
        commission,
        sellerPayout,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await this.prisma.marketplaceListing.update({
        where: { id: item.listingId },
        data: {
          stock: { decrement: item.quantity },
          salesCount: { increment: item.quantity },
        },
      });
    }

    return order;
  }

  async getOrders(sellerId: string, status?: string) {
    const where: Prisma.MarketplaceOrderWhereInput = { sellerId };
    if (status) where.status = status;

    return this.prisma.marketplaceOrder.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(id: string) {
    const order = await this.prisma.marketplaceOrder.findUnique({
      where: { id },
      include: { items: { include: { listing: true } }, seller: true },
    });

    if (!order) throw new NotFoundException('Pedido nao encontrado');
    return order;
  }

  async updateOrderStatus(id: string, status: string, trackingCode?: string) {
    const data: any = { status };

    if (status === 'SHIPPED') {
      data.shippedAt = new Date();
      if (trackingCode) data.trackingCode = trackingCode;
    }
    if (status === 'DELIVERED') data.deliveredAt = new Date();
    if (status === 'CANCELLED') data.cancelledAt = new Date();

    return this.prisma.marketplaceOrder.update({ where: { id }, data });
  }

  // ========== REVIEWS ==========

  async createReview(listingId: string, data: any) {
    const listing = await this.prisma.marketplaceListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Produto nao encontrado');

    const review = await this.prisma.marketplaceReview.create({
      data: {
        listingId,
        sellerId: listing.sellerId,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        photos: data.photos,
      },
    });

    // Update listing rating
    const listingStats = await this.prisma.marketplaceReview.aggregate({
      where: { listingId, isPublished: true },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.marketplaceListing.update({
      where: { id: listingId },
      data: {
        averageRating: listingStats._avg.rating || 0,
        totalReviews: listingStats._count,
      },
    });

    // Update seller rating
    const sellerStats = await this.prisma.marketplaceReview.aggregate({
      where: { sellerId: listing.sellerId, isPublished: true },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.marketplaceSeller.update({
      where: { id: listing.sellerId },
      data: {
        averageRating: sellerStats._avg.rating || 0,
        totalReviews: sellerStats._count,
      },
    });

    return review;
  }

  // ========== ADMIN ==========

  async getPendingListings() {
    return this.prisma.marketplaceListing.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: { seller: true, category: true },
      orderBy: { publishedAt: 'asc' },
    });
  }

  async getMarketplaceStats() {
    const [totalSellers, totalListings, totalOrders, totalRevenue] = await Promise.all([
      this.prisma.marketplaceSeller.count({ where: { isActive: true } }),
      this.prisma.marketplaceListing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.marketplaceOrder.count(),
      this.prisma.marketplaceOrder.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalSellers,
      totalListings,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }
}
