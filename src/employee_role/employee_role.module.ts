import { Module } from '@nestjs/common';
import { getGrpcClient, getRepositoryProvider } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import EmployeeRole, { EmployeeRoleSchema } from './employee_role.schema';
import { EmployeeRoleService } from './employee_role.service';
import { EmployeeRoleController } from './employee_role.controller';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      MongooseModule.forFeature([
         {
            name: EmployeeRole.name,
            schema: EmployeeRoleSchema,
         },
      ]),
   ],
   controllers: [EmployeeRoleController],
   providers: [
      EmployeeRoleService,
      getRepositoryProvider({ name: EmployeeRole.name }),
      ...providers,
   ],
   exports: [EmployeeRoleService],
})
export class EmployeeRoleModule {}
