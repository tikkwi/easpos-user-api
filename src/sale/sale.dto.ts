import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';

export class ProductPurchased {
   @IsMongoId()
   variantId: string;

   @ValidateNested()
   @Type(() => Amount)
   amount: Amount;

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
   @Type(() => ProductPurchased)
   products: Array<ProductPurchased>;
}
