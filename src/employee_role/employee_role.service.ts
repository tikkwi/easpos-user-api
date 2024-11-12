import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import Repository from '@common/core/repository';
import MerchantUserRole from './employee_role.schema';

@AppService()
export class EmployeeRoleService extends ACoreService {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<MerchantUserRole>) {
      super();
   }
}
