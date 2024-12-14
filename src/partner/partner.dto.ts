import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@shared/user/user.dto';
import Partner from './partner.schema';

export class CreatePartnerDto extends IntersectionType(
   OmitType(CreateUserDto, ['type']),
   PickType(Partner, ['isSupplier']),
) {}
