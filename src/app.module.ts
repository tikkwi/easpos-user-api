import { CoreHttpModule } from '@common/core/core_http.module';
import { Module } from '@nestjs/common';
import { UserAppModule } from './user_app/user_app.module';
import { CoreModule } from '@common/core/core.module';

@Module({
  imports: [CoreModule, CoreHttpModule, UserAppModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
