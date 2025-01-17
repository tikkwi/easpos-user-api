import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserAppModule } from './user_app/user_app.module';
import { CustomerTierModule } from './customer_tier/customer_tier.module';
import CoreModule from '@common/core/module/core.module';
import CoreHttpModule from '@common/core/module/core_http.module';
import AddressModule from '@shared/address/address.module';
import CustomerModule from './customer/customer.module';
import { PartnerModule } from './partner/partner.module';
import { AUTH_CREDENTIAL, USER_BASIC_AUTH_PATHS } from '@common/constant';
import { getGrpcClient } from '@common/utils/misc';
import { ClientsModule } from '@nestjs/microservices';
import BasicAuthMiddleware from '@common/middleware/basic_auth.middleware';

const [clients, providers] = getGrpcClient([AUTH_CREDENTIAL]);

@Module({
   imports: [
      CoreModule,
      CoreHttpModule,
      AddressModule,
      CustomerTierModule,
      CustomerModule,
      PartnerModule,
      UserAppModule,
      ClientsModule.register(clients),
   ],
   providers: [...providers],
   controllers: [],
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(BasicAuthMiddleware).forRoutes(...USER_BASIC_AUTH_PATHS);
   }
}
