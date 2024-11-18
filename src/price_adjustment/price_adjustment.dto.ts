import { IntersectionType, PickType } from '@nestjs/swagger';
import { NewSaleDto, ProductPurchased } from '../sale/sale.dto';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class GetApplicableProductAdjustmentDto extends IntersectionType(
   ProductPurchased,
   PickType(NewSaleDto, ['currencyId', 'paymentMethodId', 'customerId']),
) {}

export class GetBaseAdjustmentQueryDto extends PickType(NewSaleDto, [
   'paymentMethodId',
   'currencyId',
]) {
   @IsNumber()
   baseAmount: number;

   @IsOptional()
   @IsMongoId()
   variantId?: string;

   @IsOptional()
   @IsNumber()
   tierLevel?: number;
}
