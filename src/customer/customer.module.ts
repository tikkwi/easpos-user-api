import { Module } from '@nestjs/common';
import { getGrpcClient } from '@common/utils/misc';
import { CustomerSchema } from './customer.schema';
import { MERCHANT, SCHEMA } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { CustomerTierModule } from '../customer_tier/customer_tier.module';
import CustomerController from './customer.controller';
import CustomerService from './customer.service';
import AddressModule from '@shared/address/address.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      CustomerTierModule,
      AddressModule,
      CustomerTierModule,
   ],
   controllers: [CustomerController],
   providers: [CustomerService, { provide: SCHEMA, useValue: CustomerSchema }, ...providers],
   exports: [CustomerService],
})
export default class CustomerModule {}
