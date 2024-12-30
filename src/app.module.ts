import { Module } from '@nestjs/common';
import { UserAppModule } from './user_app/user_app.module';
import { CustomerTierModule } from './customer_tier/customer_tier.module';
import CoreModule from '@common/core/module/core.module';
import CoreHttpModule from '@common/core/module/core_http.module';
import AddressModule from '@shared/address/address.module';
import CustomerModule from './customer/customer.module';
import { PartnerModule } from './partner/partner.module';

@Module({
   imports: [
      CoreModule,
      CoreHttpModule,
      AddressModule,
      CustomerTierModule,
      CustomerModule,
      PartnerModule,
      UserAppModule,
   ],
   controllers: [],
})
export class AppModule {}
