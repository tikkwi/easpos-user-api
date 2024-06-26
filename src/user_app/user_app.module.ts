import { MERCHANT, USER } from '@common/constant';
import { getGrpcClient } from '@common/utils/misc';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserAppController } from './user_app.controller';

const [clients, providers] = getGrpcClient([USER, MERCHANT]);

@Module({
  imports: [ClientsModule.register(clients)],
  controllers: [UserAppController],
  providers: [...providers],
})
export class UserAppModule {}
