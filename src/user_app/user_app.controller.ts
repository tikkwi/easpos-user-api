import { AppController } from '@common/decorator/app_controller.decorator';
import { Body, Get, Post } from '@nestjs/common';
import { UserAppService } from './user_app.service';
import { CreateUserDto } from '@common/dto/user.dto';
import { CreateMerchantDto } from '@common/dto/merchant.dto';
import { LoginDto } from './user_app.dto';

@AppController()
export class UserAppController {
   constructor(private readonly service: UserAppService) {}

   @Post('create-merchant')
   async createMerchant(@Body() dto: CreateMerchantDto) {
      return this.service.createMerchant(dto);
   }

   @Post('create-merchant_user')
   async createUser(@Body() dto: CreateUserDto) {
      return this.service.createUser(dto);
   }

   @Post('login')
   async login(@Body() dto: LoginDto) {
      return this.service.login(dto);
   }

   @Get('test')
   async test() {
      return this.service.test();
   }
}
