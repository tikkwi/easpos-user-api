import { EAllowedUser } from '@common/utils/enum';
import EmployeeService from './employee.service';
import AppController from '@common/decorator/app_controller.decorator';
import { Body, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from '@shared/user/user.dto';

@AppController('merchant-user', [EAllowedUser.Employee])
export class EmployeeController {
   constructor(private readonly service: EmployeeService) {}

   @Post('login')
   async login(@Req() req: Request, @Body() dto: LoginDto) {
      return this.service.login(req, dto);
   }

   @Post('logout')
   async logout(@Req() req: Request, @Res() res: Response) {
      return this.service.logout(req, res);
   }
}
