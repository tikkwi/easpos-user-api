import { ADM_MRO_PWD, ADM_MRO_USR, MERCHANT, USER } from '@common/constant';
import { CreateMerchantDto } from '@common/dto/merchant.dto';
import { CreateUserDto, UserSharedServiceMethods } from '@common/dto/user.dto';
import { base64, getServiceToken } from '@common/utils/misc';
import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAppService {
  constructor(
    @Inject(getServiceToken(MERCHANT)) private readonly merchantService,
    @Inject(getServiceToken(USER)) private readonly userService: UserSharedServiceMethods,
    private readonly config: ConfigService,
  ) {}

  async test() {
    const metadata = new Metadata();
    metadata.set(
      'authorization',
      `Basic ${base64(`${this.config.get(ADM_MRO_USR)}:${this.config.get(ADM_MRO_PWD)}`)}`,
    );
    return this.merchantService.tmpTst({}, metadata);
  }

  async createUser(dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  async createMerchant(dto: CreateMerchantDto) {
    return await this.merchantService.createMerchant(dto);
  }
}
