import { Module } from '@nestjs/common';
import { UserAppController } from './user_app.controller';
import { UserAppService } from './user_app.service';

@Module({
   imports: [],
   controllers: [UserAppController],
   providers: [UserAppService],
})
export class UserAppModule {}
