import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { MERCHANT, MERCHANT_USER_ROLE, REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { MerchantUser } from './merchant_user.schema';
import { CreateMerchantUserDto } from './merchant_user.dto';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { MerchantUserRole } from '../merchant_user_role/merchant_user_role.schema';
import { MerchantUserRoleService } from '../merchant_user_role/merchant_user_role.service';

@AppService()
export class MerchantUserService extends CoreService {
   constructor(
      protected readonly context: ContextService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<MerchantUser>,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
      @Inject(getServiceToken(MERCHANT_USER_ROLE))
      private readonly userRoleService: MerchantUserRoleService,
   ) {
      super();
   }

   async create({ roleDto, merchantId, ...dto }: CreateMerchantUserDto) {
      let role: MerchantUserRole;
      if (merchantId) {
         const { data: ownerRole } = await this.userRoleService.getOwnerRole({ id: merchantId });
         if (ownerRole) throw new ForbiddenException();
         const merchant = await this.merchantService.getMerchant({ id: merchantId });
         if (!merchant) throw new BadRequestException('Merchant not found');
         role = await this.userRoleService.createOwnerRole({ id: merchantId });
      }
      if
   }
}
