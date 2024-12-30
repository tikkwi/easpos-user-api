import { Module } from '@nestjs/common';
import { CustomerTierSchema } from './customer_tier.schema';
import { CustomerTierController } from './customer_tier.controller';
import { CustomerTierService } from './customer_tier.service';
import { SCHEMA } from '@common/constant';

@Module({
   controllers: [CustomerTierController],
   providers: [CustomerTierService, { provide: SCHEMA, useValue: CustomerTierSchema }],
   exports: [CustomerTierService],
})
export class CustomerTierModule {}
