import { Module } from '@nestjs/common';
import { getGrpcClient, getRepositoryProvider } from '@common/utils/misc';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '@common/schema/customer.schema';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { CustomerTierModule } from '../customer_tier/customer_tier.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      MongooseModule.forFeature([
         {
            name: Customer.name,
            schema: CustomerSchema,
         },
      ]),
      CustomerTierModule,
   ],
   controllers: [CustomerController],
   providers: [CustomerService, getRepositoryProvider({ name: Customer.name }), ...providers],
   exports: [CustomerService],
})
export class CustomerModule {}
