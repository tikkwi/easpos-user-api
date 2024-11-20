import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { NewSaleDto, ProductPurchasedDto } from '../sale/sale.dto';
import { IsMongoId, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';

export class GetProductBasePriceDto extends OmitType(ProductPurchasedDto, ['promoCode']) {}

export class GetProductPriceDto extends IntersectionType(
   ProductPurchasedDto,
   PickType(NewSaleDto, ['currencyId', 'paymentMethodId', 'customerId']),
) {
   @ValidateNested()
   @Type(() => Amount)
   basePrice: number;
}

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

export class GetApplicableSaleAdjustmentDto {}
