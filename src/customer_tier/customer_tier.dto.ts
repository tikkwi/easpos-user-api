import { BaseDto, CoreDto } from '@common/dto/core.dto';
import { IsBoolean, IsMongoId, ValidateIf } from 'class-validator';
import CustomerTier from './customer_tier.schema';

export class GetTierDto extends BaseDto {
   @ValidateIf((o) => o.isBaseTier === undefined)
   @IsMongoId()
   id?: string;

   @ValidateIf((o) => !o.id)
   @IsBoolean()
   isBaseTier?: boolean;
}

export class CreateCustomerTierDto extends CoreDto(CustomerTier) {}
