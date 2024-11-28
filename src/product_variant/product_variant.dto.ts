import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';

export class ProductVariantDto {
   @IsString()
   @IsNotEmpty()
   variantId: string;

   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;

   @IsBoolean()
   usedAdjustment: boolean;

   @IsBoolean()
   adjustmentStackable: boolean;
}
