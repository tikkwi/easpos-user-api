import { Module } from '@nestjs/common';
import { getRepositoryProvider } from '@common/utils/misc';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '@common/schema/customer.schema';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
   imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
   controllers: [CustomerController],
   providers: [CustomerService, getRepositoryProvider({ name: Customer.name })],
   exports: [CustomerService],
})
export class CustomerModule {}
