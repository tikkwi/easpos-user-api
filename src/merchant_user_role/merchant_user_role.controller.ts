import { AppController } from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { MerchantUserRoleService } from './merchant_user_role.service';

@AppController('merchant-user-role', [EAllowedUser.Merchant])
export class MerchantUserRoleController {
   constructor(private readonly service: MerchantUserRoleService) {}
}
