import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { CreateMerchantUserRoleDto, GetMerchantUserRoleDto } from './merchant_user_role.dto';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { Merchant } from '@common/schema/merchant.schema';
import { Repository } from '@common/core/repository';
import { MerchantUserRole } from './merchant_user_role.schema';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { APP_MERCHANT } from '@common/constant/db.constant';

@AppService()
export class MerchantUserRoleService extends CoreService {
   constructor(
      protected readonly context: ContextService,
      private readonly broker: AppBrokerService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<MerchantUserRole>,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async getRole({ id, isOwner, merchantId }: GetMerchantUserRoleDto) {
      const merchant = await this.getMerchant(merchantId);
      if (!merchant) throw new BadRequestException('Merchant not found');

      return await this.repository.findOne({
         filter: {
            id,
            isOwner,
            merchant: merchantId ?? (await this.db.get<AppMerchant>(APP_MERCHANT)).merchant._id,
         },
      });
   }

   async createRole({ merchantId, isOwner, ...dto }: CreateMerchantUserRoleDto) {
      if (isOwner) {
         const { data: ownerRole } = await this.getRole({ isOwner: true, merchantId });
         if (ownerRole) throw new BadRequestException('Owner role already exists');
         return await this.repository.create({ isOwner: true, merchant: merchantId as any });
      } else {
         const merchant = (await this.db.get<AppMerchant>(APP_MERCHANT)).merchant;
         if (!merchant) throw new ForbiddenException();
         return await this.repository.create({ isOwner: false, ...dto, merchant });
      }
   }

   private async getMerchant(merchantId?: string) {
      return await this.broker.request<Merchant>({
         action: async (meta) => await this.merchantService.getMerchant({ id: merchantId }, meta),
         cache: false,
      });
   }
}
