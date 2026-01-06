import { Module } from '@nestjs/common';
import { PetSittersService } from './pet-sitters.service';
import { PetSittersController } from './pet-sitters.controller';

@Module({
  controllers: [PetSittersController],
  providers: [PetSittersService],
  exports: [PetSittersService],
})
export class PetSittersModule {}
