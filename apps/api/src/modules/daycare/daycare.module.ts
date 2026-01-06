import { Module } from '@nestjs/common';
import { DaycareService } from './daycare.service';
import { DaycareController } from './daycare.controller';

@Module({
  controllers: [DaycareController],
  providers: [DaycareService],
  exports: [DaycareService],
})
export class DaycareModule {}
