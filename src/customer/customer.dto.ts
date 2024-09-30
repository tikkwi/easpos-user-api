import { BaseDto, PickTypeIf } from '@common/dto/core.dto';
import { IsMongoId } from 'class-validator';
import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@shared/user/user.dto';
import Customer from './customer.schema';

export class AddCustomerAllowanceDto extends BaseDto {
   @IsMongoId()
   customerId: string;

   @IsMongoId()
   allowanceId: string;
}

const guestPartial: Array<keyof CreateUserDto> = ['firstName', 'lastName', 'mail', 'mobileNo'];

export class CreateCustomerDto extends IntersectionType(
   BaseDto,
   OmitType(CreateUserDto, guestPartial),
   PickTypeIf((o) => !o.guest, CreateUserDto, guestPartial),
   PickType(Customer, ['guest']),
) {}
