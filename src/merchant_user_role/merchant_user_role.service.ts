import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { MerchantUserRole } from './merchant_user_role.schema';
import { CreateMerchantUserRoleDto, GetMerchantUserRoleDto } from './merchant_user_role.dto';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';

@AppService()
export class MerchantUserRoleService extends CoreService {
   constructor(
      protected readonly context: ContextService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<MerchantUserRole>,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async getRole({ id, isOwner, merchantId }: GetMerchantUserRoleDto) {
      if (merchantId) {
         const { data: merchant } = await this.merchantService.getMerchant({ id: merchantId });
         if (!merchant) throw new NotFoundException('Merchant not found');
      }
      return {
         data: await this.repository.findOne({ filter: { id, isOwner, merchant: merchantId } }),
      };
   }

   async createRole({ merchantId, ...dto }: CreateMerchantUserRoleDto) {
      let merchant: Merchant;
      if (dto.isOwner) {
         const { data: ownerRole } = await this.getRole({ isOwner: true, merchantId });
         if (ownerRole) throw new BadRequestException('Owner role already exists');
         return {
            data: await this.repository.create({ isOwner: true, merchant: merchantId as any }),
         };
      } else {
      }
      return { data: await this.repository.create({ isOwner: true, merchant: id as any }) };
   }
}
