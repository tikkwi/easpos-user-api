import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from '@common/schema/partner.schema';
import { PartnerService } from './partner.service';
import { getRepositoryProvider } from '@common/utils/misc';
import { PartnerController } from './partner.controller';

@Module({
   imports: [MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }])],
   controllers: [PartnerController],
   providers: [PartnerService, getRepositoryProvider({ name: Partner.name })],
   exports: [PartnerService],
})
export class PartnerModule {}
