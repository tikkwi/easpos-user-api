import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { MerchantUser } from '@common/schema/merchant_user.schema';
import { CreateMerchantUserDto } from './merchant_user.dto';
import { MerchantUserRoleService } from '../merchant_user_role/merchant_user_role.service';
import { GetUserDto, MerchantUserServiceMethods } from '@common/dto/user.dto';
import { AddressService } from '@shared/address/address.service';

@AppService()
export class MerchantUserService extends CoreService implements MerchantUserServiceMethods {
   constructor(
      protected readonly context: ContextService,
      private readonly userRoleService: MerchantUserRoleService,
      private readonly addressService: AddressService,
      @Inject(REPOSITORY) private readonly repository: Repository<MerchantUser>,
   ) {
      super();
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }

   async create({ roleDto, merchantId, addressDto, ...dto }: CreateMerchantUserDto) {
      const { data: role } = await this.userRoleService.createRole({
         merchantId,
         isOwner: !!merchantId,
         ...roleDto,
      });
      const { data: address } = await this.addressService.createAddress(addressDto);

      return await this.repository.create({ ...dto, address, role, merchant: role.merchant });
   }
}
