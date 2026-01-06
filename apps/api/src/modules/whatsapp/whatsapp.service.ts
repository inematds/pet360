import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsAppService {
  private evolutionApiUrl: string;
  private evolutionApiKey: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.evolutionApiUrl = this.configService.get<string>('EVOLUTION_API_URL') || 'http://localhost:8080';
    this.evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY') || '';
  }

  private async evolutionRequest(endpoint: string, method: string = 'GET', body?: any) {
    const response = await fetch(`${this.evolutionApiUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.evolutionApiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  }

  async createInstance(businessId: string, instanceName: string) {
    const result = await this.evolutionRequest('/instance/create', 'POST', {
      instanceName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    });

    await this.prisma.business.update({
      where: { id: businessId },
      data: { whatsappInstanceId: instanceName },
    });

    return result;
  }

  async getQrCode(instanceName: string) {
    return this.evolutionRequest(`/instance/connect/${instanceName}`);
  }

  async getStatus(instanceName: string) {
    return this.evolutionRequest(`/instance/connectionState/${instanceName}`);
  }

  async sendText(instanceName: string, number: string, text: string) {
    return this.evolutionRequest(`/message/sendText/${instanceName}`, 'POST', {
      number,
      text,
    });
  }

  async sendImage(instanceName: string, number: string, imageUrl: string, caption?: string) {
    return this.evolutionRequest(`/message/sendMedia/${instanceName}`, 'POST', {
      number,
      mediatype: 'image',
      media: imageUrl,
      caption,
    });
  }

  async sendVaccineCard(businessId: string, tutorPhone: string, petId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business?.whatsappInstanceId) throw new Error('WhatsApp nao configurado');

    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: {
        tutor: true,
        vaccineRecords: {
          orderBy: { applicationDate: 'desc' },
          include: { vet: { select: { name: true, crmv: true } } },
        },
      },
    });

    if (!pet) throw new Error('Pet nao encontrado');

    const vaccineList = pet.vaccineRecords
      .map((v) => `- ${v.vaccineName}: ${new Date(v.applicationDate).toLocaleDateString('pt-BR')}`)
      .join('\n');

    const message = `*Carteira de Vacinacao - ${pet.name}*\n\n${vaccineList}\n\n_${business.name}_`;

    return this.sendText(business.whatsappInstanceId, tutorPhone, message);
  }

  async handleWebhook(businessId: string, data: any) {
    if (data.event === 'messages.upsert') {
      const message = data.data;
      await this.prisma.whatsAppMessage.create({
        data: {
          businessId,
          remoteJid: message.key.remoteJid,
          messageId: message.key.id,
          direction: message.key.fromMe ? 'OUTBOUND' : 'INBOUND',
          content: message.message?.conversation || message.message?.extendedTextMessage?.text || '',
          mediaUrl: message.message?.imageMessage?.url || null,
          mediaType: message.message?.imageMessage ? 'image' : null,
          status: 'RECEIVED',
        },
      });
    }
    return { success: true };
  }

  async getTemplates(businessId: string) {
    return this.prisma.messageTemplate.findMany({ where: { businessId } });
  }

  async createTemplate(businessId: string, data: any) {
    return this.prisma.messageTemplate.create({ data: { ...data, businessId } });
  }
}
