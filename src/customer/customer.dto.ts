import { OmitType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/core.dto';
import Customer from './customer.schema';

export class CreateCustomerDto extends OmitType(CoreDto(Customer), ['merchant', 'tier']) {}
