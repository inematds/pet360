import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private otpStore: Map<string, { code: string; expiresAt: Date }> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.passwordHash) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      businessId: user.businessId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    return this.usersService.createWithBusiness(registerDto);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario nao encontrado ou inativo');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        businessId: user.businessId,
        role: user.role,
      };

      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario nao encontrado');
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async requestOtp(phone: string) {
    // Normalizar telefone (remover caracteres especiais)
    const normalizedPhone = phone.replace(/\D/g, '');

    // Verificar se existe usuario com este telefone
    const user = await this.prisma.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      throw new BadRequestException('Telefone nao cadastrado');
    }

    // Gerar codigo OTP de 6 digitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    // Armazenar OTP (em producao, usar Redis)
    this.otpStore.set(normalizedPhone, { code, expiresAt });

    // TODO: Integrar com WhatsApp para enviar o codigo
    // await this.whatsappService.sendOtp(normalizedPhone, code);

    console.log(`[DEV] OTP para ${normalizedPhone}: ${code}`);

    return { message: 'Codigo enviado com sucesso', phone: normalizedPhone };
  }

  async verifyOtp(phone: string, code: string) {
    const normalizedPhone = phone.replace(/\D/g, '');

    const storedOtp = this.otpStore.get(normalizedPhone);

    if (!storedOtp) {
      throw new BadRequestException('Codigo nao encontrado. Solicite um novo.');
    }

    if (new Date() > storedOtp.expiresAt) {
      this.otpStore.delete(normalizedPhone);
      throw new BadRequestException('Codigo expirado. Solicite um novo.');
    }

    if (storedOtp.code !== code) {
      throw new BadRequestException('Codigo invalido');
    }

    // OTP valido, remover do store
    this.otpStore.delete(normalizedPhone);

    // Buscar usuario
    const user = await this.prisma.user.findFirst({
      where: { phone: normalizedPhone },
      include: { business: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario nao encontrado ou inativo');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      businessId: user.businessId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        businessName: user.business?.name,
      },
    };
  }
}
