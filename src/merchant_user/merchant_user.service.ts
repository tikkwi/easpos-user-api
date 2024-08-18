import { AppService } from '@common/decorator/app_service.decorator';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { MerchantUser } from './merchant_user.schema';
import { CreateMerchantUserDto } from './merchant_user.dto';
import { MerchantUserRoleService } from '../merchant_user_role/merchant_user_role.service';
import { LoginDto } from '@common/shared/user/user.dto';
import { AddressService } from '@shared/address/address.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { UserService } from '@common/shared/user/user.service';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';

@AppService()
export class MerchantUserService extends UserService {
   constructor(
      protected readonly context: ContextService,
      protected readonly db: AppRedisService,
      @Inject(REPOSITORY) protected readonly repository: Repository<MerchantUser>,
      private readonly userRoleService: MerchantUserRoleService,
      private readonly addressService: AddressService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async createUser({ roleDto, merchantId, addressDto, ...dto }: CreateMerchantUserDto) {
      const { data: role } = await this.userRoleService.createRole({
         merchantId,
         isOwner: !!merchantId,
         ...roleDto,
      });
      const { data: address } = await this.addressService.createAddress(addressDto);

      return await this.repository.create({ ...dto, address, role, merchant: role.merchant });
   }

   async loginUser(dto: LoginDto) {
      return await this.login(
         dto,
         async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
      );
   }
}
