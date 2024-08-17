import { Module } from '@nestjs/common';
import { getGrpcClient, getRepositoryProvider } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantUserRole, MerchantUserRoleSchema } from './merchant_user_role.schema';
import { MerchantUserRoleService } from './merchant_user_role.service';
import { MerchantUserRoleController } from './merchant_user_role.controller';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      MongooseModule.forFeature([
         {
            name: MerchantUserRole.name,
            schema: MerchantUserRoleSchema,
         },
      ]),
   ],
   controllers: [MerchantUserRoleController],
   providers: [
      MerchantUserRoleService,
      getRepositoryProvider({ name: MerchantUserRole.name }),
      ...providers,
   ],
   exports: [MerchantUserRoleService],
})
export class MerchantUserRoleModule {}
