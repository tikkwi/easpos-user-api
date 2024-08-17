import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerTier, CustomerTierSchema } from './customer_tier.schema';
import { CustomerTierController } from './customer_tier.controller';
import { CustomerTierService } from './customer_tier.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
   imports: [MongooseModule.forFeature([{ name: CustomerTier.name, schema: CustomerTierSchema }])],
   controllers: [CustomerTierController],
   providers: [CustomerTierService, getRepositoryProvider({ name: CustomerTier.name })],
   exports: [CustomerTierService],
})
export class CustomerTierModule {}
