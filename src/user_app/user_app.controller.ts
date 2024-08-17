import { AppController } from '@common/decorator/app_controller.decorator';
import { Get } from '@nestjs/common';
import { UserAppService } from './user_app.service';

@AppController()
export class UserAppController {
   constructor(private readonly service: UserAppService) {}

   @Get('test')
   async test() {
      return this.service.test();
   }
}
