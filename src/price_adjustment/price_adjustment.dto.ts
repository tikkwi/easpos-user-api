import { IntersectionType, PickType } from '@nestjs/swagger';
import { NewSaleDto } from '../sale/sale.dto';
import { IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { GetStockPurchasedDto } from '../stock_unit/stock_unit.dto';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';
import { Adjustment } from './price_adjustment.schema';

// export class GetProductBasePriceDto extends OmitType(ProductPurchasedDto, ['promoCode']) {}

export class GetApplicableProductAdjustmentDto extends IntersectionType(
   GetStockPurchasedDto,
   PickType(NewSaleDto, ['currencyId', 'paymentMethodId', 'customerId']),
) {
   @IsOptional()
   @IsString()
   promoCode: string;
}

export class GetBaseAdjustmentQueryDto extends PickType(NewSaleDto, [
   'currencyId',
   'paymentMethodId',
]) {
   @IsNumber()
   price: number;

   @IsOptional()
   @IsNumber()
   tierLevel?: number;

   @IsOptional()
   @IsNumber()
   quantity?: number;

   @IsOptional()
   @IsMongoId()
   variantId?: string;
}

export class GetProductPriceDto {
   @IsMongoId()
   productId: string;

   @ValidateNested()
   @Type(() => Amount)
   price: Amount;

   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;

   @ValidateNested()
   @Type(() => Adjustment)
   adjustment: Adjustment;
}

export class GetFocProductsDto extends IntersectionType(
   PickType(GetProductPriceDto, ['productId', 'quantity']),
   PickType(Adjustment, ['focStocksWithTargetAmount', 'focStocks', 'applyWholeSale']),
) {}
