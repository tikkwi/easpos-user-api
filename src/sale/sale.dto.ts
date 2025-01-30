import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { GetStockPurchasedDto } from '../stock_unit/stock_unit.dto';
import { BasePayment, Duration } from '@common/dto/entity.dto';
import { GetCustomerDto } from '../customer/customer.dto';

export class NewSaleDto {
   @IsOptional()
   @IsString()
   promoCode?: string;

   @ValidateNested()
   @Type(() => BasePayment)
   payment: BasePayment;

   @IsOptional()
   @IsMongoId()
   customerId?: string;

   @ValidateNested({ each: true })
   @Type(() => OmitType(GetStockPurchasedDto, ['customerId']))
   products: Array<Omit<GetStockPurchasedDto, 'customerId'>>;
}

export class GetCustomerPurchaseDto extends GetCustomerDto {
   @IsOptional()
   @ValidateNested()
   @Type(() => Duration)
   duration?: Duration;
}
