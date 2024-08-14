import { Module } from '@nestjs/common';
import { getGrpcClient } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantUser, MerchantUserSchema } from '@common/schema/merchant_user.schema';
import { MerchantUserService } from './merchant_user.service';
import { MerchantUserController } from './merchant_user.controller';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      MongooseModule.forFeature([
         {
            name: MerchantUser.name,
            schema: MerchantUserSchema,
         },
      ]),
   ],
   controllers: [MerchantUserController],
   providers: [MerchantUserService, ...providers],
   exports: [MerchantUserService],
})
export class MerchantUserModule {}
