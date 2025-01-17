import { Body, Get, Post, Query, Req } from '@nestjs/common';
import { UserAppService } from './user_app.service';
import AppController from '@common/decorator/app_controller.decorator';
import { CreateMerchantDto } from '@common/dto/merchant.dto';
import { Request } from 'express';

@AppController()
export class UserAppController {
   constructor(private readonly service: UserAppService) {}

   @Get('test')
   async test() {
      return this.service.test();
   }

   @Get('ms-test')
   async msTest(@Query('msg') message: string) {
      return this.service.msTest({ message });
   }

   @Post('create-merchant')
   async createMerchant(@Body() dto: CreateMerchantDto, @Req() { ctx }: Request) {
      return this.service.createMerchant({ ctx, ...dto });
   }
}
