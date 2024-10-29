import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { UserService } from '@shared/user/user.service';
import ContextService from '@common/core/context/context.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
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
   ) {
      super();
   }

   // async loginUser(dto: LoginDto) {
   //    return await this.login(
   //       dto,
   //       async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
   //    );
   // }
}
