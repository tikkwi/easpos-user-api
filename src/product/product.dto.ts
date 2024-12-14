import { IsMongoId, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CoreDto } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';
import Product from './product.schema';
import { Type } from 'class-transformer';
import { Amount, BasicInfo } from '@common/dto/entity.dto';
import StockUnit from '../stock_unit/stock_unit.schema';
import { CategoryDto } from '@shared/category/category.dto';

export class CreateProductDto extends OmitType(CoreDto(Product), [
   'category',
   'tags',
   'unit',
   'context',
]) {
   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => CategoryDto)
   tagsDto?: Array<CategoryDto>;

   @ValidateNested({ each: true })
   @Type(() => OmitType(CategoryDto, ['type']))
   categoryDto: CategoryDto;

   @IsOptional()
   @IsMongoId()
   unitId: string;
}

export class StockUnitFullDto {
   @ValidateNested()
   @Type(() => StockUnit)
   stock: StockUnit;

   @IsNumber()
   quantity: Amount;
}

class ProductVariantCompactDto extends BasicInfo {
   @ValidateNested({ each: true })
   @Type(() => Array<StockUnitFullDto>)
   units: Array<StockUnitFullDto>;
}

export class ProductCompactDto extends BasicInfo {
   @ValidateNested()
   @Type(() => ProductVariantCompactDto)
   variant: ProductVariantCompactDto;
}
