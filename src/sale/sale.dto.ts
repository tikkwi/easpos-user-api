import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';

class StockUnitPurchasedDto {
   @IsMongoId()
   barcode: string;

   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;
}

export class ProductPurchasedDto {
   //TODO: validate all are following variant's unit
   @ValidateNested({ each: true })
   @Type(() => StockUnitPurchasedDto)
   stockUnits: Array<StockUnitPurchasedDto>;

   @IsMongoId()
   variantId: string;

   @IsOptional()
   @IsString()
   promoCode?: string;
}

export class NewSaleDto {
   @IsOptional()
   @IsString()
   promoCode?: string;

   @IsOptional()
   @IsMongoId()
   customerId: string;

   @IsMongoId()
   currencyId: string;

   @IsMongoId()
   paymentMethodId: string;

   @ValidateNested({ each: true })
   @Type(() => ProductPurchasedDto)
   products: Array<ProductPurchasedDto>;
}
