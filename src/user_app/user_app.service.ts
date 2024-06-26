import { MERCHANT, USER } from '@common/constant';
import {
  CreateMerchantDto,
  MerchantSharedServiceMethods,
} from '@common/dto/merchant.dto';
import { CreateUserDto, UserSharedServiceMethods } from '@common/dto/user.dto';
import { getServiceToken } from '@common/utils/misc';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserAppService {
  constructor(
    @Inject(getServiceToken(MERCHANT))
    private readonly merchantService: MerchantSharedServiceMethods,
    @Inject(getServiceToken(USER))
    private readonly userService: UserSharedServiceMethods,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  async createMerchant(dto: CreateMerchantDto) {
    return await this.merchantService.createMerchant(dto);
  }
}
