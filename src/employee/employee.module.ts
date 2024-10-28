import { Module } from '@nestjs/common';
import { getGrpcClient, getRepositoryProvider } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import Employee, { EmployeeSchema } from './employee.schema';
import EmployeeService from './employee.service';
import { EmployeeController } from './employee.controller';
import AddressModule from '@shared/address/address.module';
import { EmployeeRoleModule } from '../employee_role/employee_role.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      EmployeeRoleModule,
      AddressModule,
      MongooseModule.forFeature([
         {
            name: Employee.name,
            schema: EmployeeSchema,
         },
      ]),
   ],
   controllers: [EmployeeController],
   providers: [EmployeeService, ...providers, getRepositoryProvider({ name: Employee.name })],
   exports: [EmployeeService],
})
export class EmployeeModule {}
