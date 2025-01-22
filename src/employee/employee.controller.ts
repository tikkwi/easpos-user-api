import { EAllowedUser } from '@common/utils/enum';
import EmployeeService from './employee.service';
import AppController from '@common/decorator/app_controller.decorator';
import { Body, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticateLoginMfaDto, LoginDto } from '@shared/user/user.dto';
import { SkipUsers } from '@common/decorator/allowance.decorator';

@AppController('employee', [EAllowedUser.Employee])
export class EmployeeController {
   constructor(private readonly service: EmployeeService) {}

   @SkipUsers([EAllowedUser.Employee])
   @Post('login')
   async login(@Req() req: Request, @Body() dto: LoginDto) {
      return this.service.login(req, dto);
   }

   @SkipUsers([EAllowedUser.Employee])
   @Post('authenticate-login-mfa')
   async authLoginMfa(@Req() req: Request, @Body() dto: AuthenticateLoginMfaDto) {
      return this.service.authenticateLoginMfa(req, dto);
   }

   @Post('logout')
   async logout(@Req() req: Request, @Res() res: Response) {
      return this.service.logout(req, res);
   }
}
