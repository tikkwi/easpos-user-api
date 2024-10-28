import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { CreateEmployeeDto } from './employee.dto';
import { EmployeeRoleService } from '../employee_role/employee_role.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { UserService } from '@shared/user/user.service';
import ContextService from '@common/core/context/context.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
import AddressService from '@shared/address/address.service';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import Employee from './employee.schema';

@AppService()
export default class EmployeeService extends UserService {
   constructor(
      protected readonly context: ContextService,
      protected readonly db: AppRedisService,
      protected readonly appBroker: AppBrokerService,
      @Inject(REPOSITORY) protected readonly repository: Repository<Employee>,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
      private readonly userRoleService: EmployeeRoleService,
      private readonly addressService: AddressService,
   ) {
      super();
   }

   async createUser({ roleDto, merchantId, addressDto, ...dto }: CreateEmployeeDto) {
      const { data: role } = await this.userRoleService.createRole({
         merchantId,
         isOwner: !!merchantId,
         ...roleDto,
      });
      const { data: address } = await this.addressService.create(addressDto);

      return await this.repository.create({ ...dto, address, role, merchant: role.merchant });
   }

   // async loginUser(dto: LoginDto) {
   //    return await this.login(
   //       dto,
   //       async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
   //    );
   // }
}
