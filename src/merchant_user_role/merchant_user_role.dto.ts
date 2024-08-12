import { CoreDto } from '@common/dto/core.dto';
import { MerchantUserRole } from './merchant_user_role.schema';

export class CreateMerchantRoleDto extends CoreDto<MerchantUserRole>(MerchantUserRole) {}
