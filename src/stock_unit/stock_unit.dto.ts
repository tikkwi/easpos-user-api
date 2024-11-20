import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { FindByIdDto, FindDto } from '@common/dto/core.dto';
import { ExchangeUnitDto } from '@shared/unit/unit.dto';
import { IsBoolean, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';

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

export class GetStockPurchasedDto {
   @IsString()
   barcode: string;

   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;

   @IsBoolean()
   nextBatchOnStockOut: boolean;

   @IsOptional()
   @IsMongoId()
   customerId?: string;
}
