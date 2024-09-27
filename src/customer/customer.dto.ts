import { OmitType } from '@nestjs/swagger';
import { BaseDto, CoreDto } from '@common/dto/core.dto';
import Customer from './customer.schema';
import { IsMongoId } from 'class-validator';

export class CreateCustomerDto extends OmitType(CoreDto(Customer), ['merchant', 'tier']) {}

export class AddCustomerAllowanceDto extends BaseDto {
   @IsMongoId()
   customerId: string;

   @IsMongoId({ each: true })
   allowanceIds: string[];
}
