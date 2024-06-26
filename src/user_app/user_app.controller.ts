import { AppController } from '@common/decorator/app_controller.decorator';
import { Body, Post } from '@nestjs/common';
import { UserAppService } from './user_app.service';
import { CreateUserDto } from '@common/dto/user.dto';
import { CreateMerchantDto } from '@common/dto/merchant.dto';

@AppController()
export class UserAppController {
  constructor(private readonly service: UserAppService) {}

  @Post('create-merchant')
  async createMerchant(@Body() dto: CreateMerchantDto) {
    return await this.service.createMerchant(dto);
  }

  @Post('create-user')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.service.createUser(dto);
  }
}
