import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomerTierModule } from './customer_tier/customer_tier.module';
import CoreModule from '@common/core/module/core.module';
import CoreHttpModule from '@common/core/module/core_http.module';
import AddressModule from '@shared/address/address.module';
import CustomerModule from './customer/customer.module';
import { PartnerModule } from './partner/partner.module';
import { AUTH_CREDENTIAL, MERCHANT, MERCHANT_BASIC_AUTH_PATHS } from '@common/constant';
import { getGrpcClient } from '@common/utils/misc';
import { ClientsModule } from '@nestjs/microservices';
import BasicAuthMiddleware from '@common/middleware/basic_auth.middleware';
import AuthGuard from '@common/guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmployeeModule } from './employee/employee.module';
import AppController from './app.controller';
import AppService from './app.service';

const [clients, providers] = getGrpcClient([AUTH_CREDENTIAL, MERCHANT]);

@Module({
   imports: [
      CoreModule,
      CoreHttpModule,
      AddressModule,
      CustomerTierModule,
      CustomerModule,
      PartnerModule,
      ClientsModule.register(clients),
      EmployeeModule,
   ],
   providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }, ...providers],
   controllers: [AppController],
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(BasicAuthMiddleware).forRoutes(...MERCHANT_BASIC_AUTH_PATHS);
   }
}
