import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { TutorsModule } from './modules/tutors/tutors.module';
import { PetsModule } from './modules/pets/pets.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ServicesModule } from './modules/services/services.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { VaccinesModule } from './modules/vaccines/vaccines.module';
import { AdoptionModule } from './modules/adoption/adoption.module';
import { BoardingModule } from './modules/boarding/boarding.module';
import { DaycareModule } from './modules/daycare/daycare.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { FinanceModule } from './modules/finance/finance.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PetSittersModule } from './modules/pet-sitters/pet-sitters.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    TutorsModule,
    PetsModule,
    AppointmentsModule,
    ServicesModule,
    MedicalRecordsModule,
    VaccinesModule,
    AdoptionModule,
    BoardingModule,
    DaycareModule,
    ProductsModule,
    SalesModule,
    FinanceModule,
    WhatsAppModule,
    AnalyticsModule,
    PetSittersModule,
    MarketplaceModule,
  ],
})
export class AppModule {}
