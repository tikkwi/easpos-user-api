import { EAllowedUser } from '@common/utils/enum';
import EmployeeService from './employee.service';
import { Body, Post } from '@nestjs/common';
import { CreateEmployeeDto } from './employee.dto';
import AppController from '@common/decorator/app_controller.decorator';

@AppController('merchant-user', [EAllowedUser.Merchant])
export class EmployeeController {
   constructor(private readonly service: EmployeeService) {}

   @Post('create')
   async create(@Body() dto: CreateEmployeeDto) {
      return this.service.createUser(dto);
   }
}
