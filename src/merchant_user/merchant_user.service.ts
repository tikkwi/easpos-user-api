import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { MERCHANT, MERCHANT_USER_ROLE, REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { MerchantUser } from '@common/schema/merchant_user.schema';
import { CreateMerchantUserDto } from './merchant_user.dto';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { MerchantUserRole } from '../merchant_user_role/merchant_user_role.schema';
import { MerchantUserRoleService } from '../merchant_user_role/merchant_user_role.service';
import { GetUserDto, MerchantUserServiceMethods } from '@common/dto/user.dto';

@AppService()
export class MerchantUserService extends CoreService implements MerchantUserServiceMethods{
   constructor(
      protected readonly context: ContextService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<MerchantUser>,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
      private readonly userRoleService: MerchantUserRoleService,
   ) {
      super();
   }

   async getUser(dto: GetUserDto){
      return await this.repository.findOne({filter: dto})
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
