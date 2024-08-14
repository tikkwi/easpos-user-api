import { Module } from '@nestjs/common';
import { UserAppModule } from './user_app/user_app.module';
import { getGrpcClient } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import { CoreModule } from '@common/core/module/core.module';
import { CoreHttpModule } from '@common/core/module/core_http.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [CoreModule, CoreHttpModule, ClientsModule.register(clients), UserAppModule],
   controllers: [],
   providers: [...providers],
})
export class AppModule {}

// export class AppModule implements NestModule {
//    configure(consumer: MiddlewareConsumer) {
//       consumer.apply(TransformRequestMiddleware).forRoutes('*');
//    }
// }
