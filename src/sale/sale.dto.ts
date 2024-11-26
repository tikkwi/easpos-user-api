import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { GetStockPurchasedDto } from '../stock_unit/stock_unit.dto';

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
   @Type(() => OmitType(GetStockPurchasedDto, ['customerId']))
   products: Array<Omit<GetStockPurchasedDto, 'customerId'>>;
}
