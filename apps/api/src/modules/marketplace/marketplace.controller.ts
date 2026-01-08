import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) {}

  // ========== SELLERS ==========

  @Post('sellers/register')
  @ApiOperation({ summary: 'Cadastrar como vendedor' })
  async registerSeller(@Body() dto: RegisterSellerDto) {
    return this.marketplaceService.registerSeller(dto);
  }

  @Get('sellers/:id')
  @ApiOperation({ summary: 'Detalhes do vendedor' })
  async getSeller(@Param('id') id: string) {
    return this.marketplaceService.getSeller(id);
  }

  @Put('sellers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do vendedor' })
  async updateSeller(@Param('id') id: string, @Body() data: Partial<RegisterSellerDto>) {
    return this.marketplaceService.updateSeller(id, data);
  }

  // ========== CATEGORIES ==========

  @Get('categories')
  @ApiOperation({ summary: 'Listar categorias' })
  async getCategories() {
    return this.marketplaceService.getCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar categoria (Admin)' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.marketplaceService.createCategory(dto);
  }

  // ========== LISTINGS ==========

  @Get('listings')
  @ApiOperation({ summary: 'Listar produtos' })
  async getListings(
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('species') species?: string,
    @Query('size') size?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
    @Query('freeShipping') freeShipping?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.marketplaceService.getListings({
      categoryId,
      sellerId,
      species,
      size,
      minPrice,
      maxPrice,
      search,
      freeShipping,
      sortBy,
      page,
      limit,
    });
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Detalhes do produto' })
  async getListing(@Param('id') id: string) {
    return this.marketplaceService.getListing(id);
  }

  @Post('sellers/:sellerId/listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar anuncio de produto' })
  async createListing(@Param('sellerId') sellerId: string, @Body() dto: CreateListingDto) {
    return this.marketplaceService.createListing(sellerId, dto);
  }

  @Put('listings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar anuncio' })
  async updateListing(@Param('id') id: string, @Body() dto: Partial<CreateListingDto>) {
    return this.marketplaceService.updateListing(id, dto);
  }

  @Post('listings/:id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar anuncio para revisao' })
  async publishListing(@Param('id') id: string) {
    return this.marketplaceService.publishListing(id);
  }

  @Delete('listings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover anuncio' })
  async deleteListing(@Param('id') id: string) {
    return this.marketplaceService.deleteListing(id);
  }

  // ========== ORDERS ==========

  @Post('orders')
  @ApiOperation({ summary: 'Criar pedido' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.marketplaceService.createOrder(dto);
  }

  @Get('sellers/:sellerId/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar pedidos do vendedor' })
  async getOrders(@Param('sellerId') sellerId: string, @Query('status') status?: string) {
    return this.marketplaceService.getOrders(sellerId, status);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalhes do pedido' })
  async getOrder(@Param('id') id: string) {
    return this.marketplaceService.getOrder(id);
  }

  @Put('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status do pedido' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() data: { status: string; trackingCode?: string },
  ) {
    return this.marketplaceService.updateOrderStatus(id, data.status, data.trackingCode);
  }

  // ========== REVIEWS ==========

  @Post('listings/:listingId/reviews')
  @ApiOperation({ summary: 'Avaliar produto' })
  async createReview(@Param('listingId') listingId: string, @Body() dto: CreateReviewDto) {
    return this.marketplaceService.createReview(listingId, dto);
  }

  // ========== ADMIN ==========

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar anuncios pendentes de aprovacao' })
  async getPendingListings() {
    return this.marketplaceService.getPendingListings();
  }

  @Post('admin/listings/:id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar anuncio' })
  async approveListing(@Param('id') id: string) {
    return this.marketplaceService.approveListing(id);
  }

  @Post('admin/listings/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejeitar anuncio' })
  async rejectListing(@Param('id') id: string, @Body() data: { reason: string }) {
    return this.marketplaceService.rejectListing(id, data.reason);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatisticas do marketplace' })
  async getStats() {
    return this.marketplaceService.getMarketplaceStats();
  }
}
