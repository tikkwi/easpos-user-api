import { EAllowedUser } from '@common/utils/enum';
import AppController from '@common/decorator/app_controller.decorator';
import CustomerService from './customer.service';
import { Body, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from '@shared/user/user.dto';
import { Request, Response } from 'express';

@AppController('customer', [EAllowedUser.Employee])
export default class CustomerController {
   constructor(protected readonly service: CustomerService) {}

   @Post('login')
   async login(@Req() req: Request, @Body() dto: LoginDto) {
      return this.service.login(req, dto);
   }

   @Post('logout')
   async logout(@Req() req: Request, @Res() res: Response) {
      return this.service.logout(req, res);
   }
}
