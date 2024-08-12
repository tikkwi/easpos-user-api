import { CoreHttpModule } from '@common/core/core_http.module';
import { Module } from '@nestjs/common';
import { UserAppModule } from './user_app/user_app.module';
import { CoreModule } from '@common/core/core.module';
import { getGrpcClient } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';

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
