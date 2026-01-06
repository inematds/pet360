import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { business: true },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: { business: true },
    });
  }

  async findByBusinessId(businessId: string) {
    return this.prisma.user.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    });
  }

  async createWithBusiness(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.findByEmail(dto.userEmail);
    if (existingUser) {
      throw new ConflictException('Email ja cadastrado');
    }

    // Create slug from business name
    const slug = dto.businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingBusiness = await this.prisma.business.findUnique({
      where: { slug },
    });

    const finalSlug = existingBusiness
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create business and user in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const business = await prisma.business.create({
        data: {
          name: dto.businessName,
          slug: finalSlug,
          cnpj: dto.cnpj,
          phone: dto.businessPhone,
          email: dto.businessEmail,
          businessTypes: dto.businessTypes,
        },
      });

      const user = await prisma.user.create({
        data: {
          businessId: business.id,
          name: dto.userName,
          email: dto.userEmail,
          phone: dto.userPhone,
          role: 'OWNER',
          passwordHash,
        },
      });

      return { business, user };
    });

    const { passwordHash: _, ...userWithoutPassword } = result.user;
    return {
      business: result.business,
      user: userWithoutPassword,
    };
  }

  async update(id: string, data: any) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
