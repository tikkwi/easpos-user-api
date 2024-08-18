import { Module } from '@nestjs/common';
import { getGrpcClient, getRepositoryProvider } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantUser, MerchantUserSchema } from './merchant_user.schema';
import { MerchantUserService } from './merchant_user.service';
import { MerchantUserController } from './merchant_user.controller';
import { MerchantUserRoleModule } from '../merchant_user_role/merchant_user_role.module';
import { AddressModule } from '@shared/address/address.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      MerchantUserRoleModule,
      AddressModule,
      MongooseModule.forFeature([
         {
            name: MerchantUser.name,
            schema: MerchantUserSchema,
         },
      ]),
   ],
   controllers: [MerchantUserController],
   providers: [
      MerchantUserService,
      ...providers,
      getRepositoryProvider({ name: MerchantUser.name }),
   ],
   exports: [MerchantUserService],
})
export class MerchantUserModule {}
