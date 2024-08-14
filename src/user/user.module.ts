import { Module } from '@nestjs/common';
import { getGrpcClient } from '@common/utils/misc';
import { ADMIN } from '@common/constant';
import { MerchantUserModule } from '../merchant_user/merchant_user.module';
import { CustomerModule } from '../customer/customer.module';
import { PartnerModule } from '../partner/partner.module';
import { ClientsModule } from '@nestjs/microservices';
import { UserService } from '@common/shared/user/user.service';

const [clients, providers] = getGrpcClient([ADMIN]);

@Module({
   imports: [MerchantUserModule, CustomerModule, PartnerModule, ClientsModule.register(clients)],
   providers: [...providers, UserService],
   exports: [UserService],
})
export class UserModule {}
