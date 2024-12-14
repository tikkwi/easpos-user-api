import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { BaseDto, FindByIdDto, FindDto } from '@common/dto/core.dto';
import { ExchangeUnitDto } from '@shared/unit/unit.dto';
import {
   IsBoolean,
   IsMongoId,
   IsOptional,
   IsString,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';
import StockUnit from './stock_unit.schema';

export class CreateStockUnitDto extends OmitType(StockUnit, [
   'productVariant',
   'batch',
   'stockLocation',
   'section',
   'shelf',
]) {
   @IsMongoId()
   variantId: string;

   @IsMongoId()
   batchId: string;

   @IsMongoId()
   locationId: string;

   @IsMongoId()
   sectionId: string;

   @IsMongoId()
   shelfId: string;
}

export class GetStockUnitDto extends OmitType(FindDto, ['errorOnNotFound']) {
   @IsString()
   barcode: string;

   @IsOptional()
   @IsMongoId()
   variantId?: string;
}

export class GetStockLeftDto extends IntersectionType(
   PickType(FindByIdDto, ['id']),
   PickType(ExchangeUnitDto, ['targetId']),
) {}

export class GetStockPurchasedDto extends BaseDto {
   @ValidateIf((o) => !o.variantId)
   @IsString()
   barcode?: string;

   @ValidateIf((o) => !o.barcode)
   @IsString()
   variantId?: string;

   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;

   @IsBoolean()
   nextBatchOnStockOut: boolean;

   @IsOptional()
   @IsMongoId()
   customerId?: string;

   @IsOptional()
   @IsBoolean()
   isFoc?: boolean;
}
