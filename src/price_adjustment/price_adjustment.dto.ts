import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { NewSaleDto } from '../sale/sale.dto';
import {
   IsBoolean,
   IsMongoId,
   IsNumber,
   IsOptional,
   IsString,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { GetStockPurchasedDto } from '../stock_unit/stock_unit.dto';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';
import { Adjustment } from './price_adjustment.schema';
import { BaseDto } from '@common/dto/core.dto';

class PreliminaryProductVariantDto {
   @IsMongoId()
   id: string;

   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;

   @IsBoolean()
   appliedUnstackableAdjustment: boolean;
}
class PreliminarySaleDto {
   @ValidateNested({ each: true })
   @Type(() => PreliminaryProductVariantDto)
   products: Array<PreliminaryProductVariantDto>;

   @ValidateNested()
   @Type(() => Amount)
   price: Amount;
}

export class GetApplicableAdjustmentDto extends IntersectionType(
   PickType(NewSaleDto, ['currencyId', 'paymentMethodId', 'customerId']),
   BaseDto,
) {
   @IsOptional()
   @IsString()
   promoCode: string;

   @ValidateIf((o) => !o.sale)
   @ValidateNested()
   @Type(() => OmitType(GetStockPurchasedDto, ['context', 'customerId']))
   product?: Omit<GetStockPurchasedDto, 'context' | 'customerId'>;

   @ValidateIf((o) => !o.product)
   @ValidateNested()
   @Type(() => PreliminarySaleDto)
   sale?: PreliminarySaleDto;
}

export class GetAdjustedPriceDto extends BaseDto {
   @IsBoolean()
   isMarkup: boolean;

   @IsOptional()
   @IsMongoId()
   productId?: string;

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

export class GetBaseAdjustmentQueryDto extends PickType(NewSaleDto, [
   'currencyId',
   'paymentMethodId',
]) {
   @ValidateNested()
   @Type(() => Amount)
   price: Amount;

   @IsOptional()
   @IsNumber()
   tierLevel?: number;

   @IsOptional()
   @IsNumber()
   quantity?: number;

   @IsOptional()
   @IsMongoId()
   variantId?: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => OmitType(PreliminaryProductVariantDto, ['appliedUnstackableAdjustment']))
   variants?: Array<Omit<PreliminaryProductVariantDto, 'appliedUnstackableAdjustment'>>;
}

export class GetFocProductsDto extends IntersectionType(
   PickType(GetAdjustedPriceDto, ['quantity']),
   PickType(Adjustment, ['focStocksWithTargetAmount', 'focStocks']),
   BaseDto,
) {
   @ValidateIf((o) => o.focStocksWithTargetAmount)
   @IsMongoId()
   productId?: string;
}
