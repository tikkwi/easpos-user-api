import { Module } from '@nestjs/common';
import { getGrpcClient } from '@common/utils/misc';
import { MERCHANT, SCHEMA } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeSchema } from './employee.schema';
import EmployeeService from './employee.service';
import { EmployeeController } from './employee.controller';
import AddressModule from '@shared/address/address.module';
import { EmployeeRoleModule } from '../employee_role/employee_role.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [ClientsModule.register(clients), EmployeeRoleModule, AddressModule],
   controllers: [EmployeeController],
   providers: [EmployeeService, { provide: SCHEMA, useValue: EmployeeSchema }, ...providers],
   exports: [EmployeeService],
})
export class EmployeeModule {}
