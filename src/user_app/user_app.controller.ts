import { Body, Get } from '@nestjs/common';
import { UserAppService } from './user_app.service';
import AppController from '@common/decorator/app_controller.decorator';

@AppController()
export class UserAppController {
   constructor(private readonly service: UserAppService) {}

   @Get('test')
   async test(@Body() dto: any) {
      console.log('hi', dto);
      return this.service.test();
   }

   @Get('ms-test')
   async msTest() {
      return this.service.msTest();
   }
}
