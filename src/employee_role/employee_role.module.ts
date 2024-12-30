import { Module } from '@nestjs/common';
import { getGrpcClient } from '@common/utils/misc';
import { MERCHANT, SCHEMA } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeRoleSchema } from './employee_role.schema';
import { EmployeeRoleService } from './employee_role.service';
import { EmployeeRoleController } from './employee_role.controller';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [ClientsModule.register(clients)],
   controllers: [EmployeeRoleController],
   providers: [
      EmployeeRoleService,
      { provide: SCHEMA, useValue: EmployeeRoleSchema },
      ...providers,
   ],
   exports: [EmployeeRoleService],
})
export class EmployeeRoleModule {}
