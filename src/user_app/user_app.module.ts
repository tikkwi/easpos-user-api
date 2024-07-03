import { MERCHANT, USER } from '@common/constant';
import { getGrpcClient } from '@common/utils/misc';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserAppController } from './user_app.controller';
import { UserAppService } from './user_app.service';

const [clients, providers] = getGrpcClient([USER, MERCHANT]);

@Module({
  imports: [ClientsModule.register(clients)],
  controllers: [UserAppController],
  providers: [...providers, UserAppService],
})
export class UserAppModule {}
