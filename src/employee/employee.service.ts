import { Inject } from '@nestjs/common';
import { MERCHANT } from '@common/constant';
import { getServiceToken } from '@common/utils/regex';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { AUserService } from '@shared/user/user.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import Employee from './employee.schema';
import AddressService from '@shared/address/address.service';
import CategoryService from '@shared/category/category.service';
import { ModuleRef } from '@nestjs/core';
import { CreateEmployeeDto } from './employee.dto';
import { EmployeeRoleService } from '../employee_role/employee_role.service';

@AppService()
export default class EmployeeService extends AUserService<Employee> {
   constructor(
      protected readonly moduleRef: ModuleRef,
      protected readonly db: AppRedisService,
      protected readonly appBroker: AppBrokerService,
      protected readonly addressService: AddressService,
      protected readonly categoryService: CategoryService,
      private readonly employeeRoleService: EmployeeRoleService,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async createEmployee({ roleId, isOwner, ctx, ...dto }: CreateEmployeeDto) {
      const repository = await this.getRepository(ctx.connection, ctx.session);
      if (isOwner) {
         const { data: owner } = await repository.findOne({ filter: { isOwner: true } });
         if (owner) throw new Error('Owner already exists');
      }
      const { data: role } = roleId
         ? await this.employeeRoleService.findById({ id: roleId })
         : { data: undefined };
      return await repository.create({
         role,
         isOwner,
         ...(await this.getCreateUserDto({ ctx, ...dto })),
      });
   }

   // async loginUser(dto: LoginDto) {
   //    return await this.login(
   //       dto,
   //       async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
   //    );
   // }
}
