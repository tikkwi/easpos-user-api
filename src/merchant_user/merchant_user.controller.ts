import { AppController } from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { MerchantUserService } from './merchant_user.service';
import { Body, Post } from '@nestjs/common';
import { CreateMerchantUserDto } from './merchant_user.dto';

@AppController('merchant-user', [EAllowedUser.Merchant])
export class MerchantUserController {
   constructor(private readonly service: MerchantUserService) {}

   @Post('create')
   async create(@Body() dto: CreateMerchantUserDto) {
      return this.service.createUser(dto);
   }
}
