import { IntersectionType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@shared/user/user.dto';
import Partner from './partner.schema';
import { BaseDto } from '@common/dto/core.dto';

export class CreatePartnerDto extends IntersectionType(
   BaseDto,
   CreateUserDto,
   PickType(Partner, ['isSupplier']),
) {}
