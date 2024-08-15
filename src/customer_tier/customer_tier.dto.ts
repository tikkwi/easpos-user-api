import { OmitType } from '@nestjs/swagger';
import { CustomerTier } from './customer_tier.schema';
import { CoreDto } from '@common/dto/core.dto';
import { IsBoolean, IsMongoId, ValidateIf } from 'class-validator';

export class GetTierDto {
   @ValidateIf((o) => o.isBaseTier === undefined)
   @IsMongoId()
   id?: string;

   @ValidateIf((o) => !o.id)
   @IsBoolean()
   isBaseTier?: boolean;
}

export class CreateCustomerTierDto extends OmitType(CoreDto(CustomerTier), ['merchant']) {}
