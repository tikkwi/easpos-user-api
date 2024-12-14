import { IntersectionType, OmitType } from '@nestjs/swagger';
import { ProductVariant } from './product_variant.schema';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from '@shared/category/category.dto';
import { BaseDto } from '@common/dto/core.dto';

export class CreateProductVariantDto extends IntersectionType(
   OmitType(ProductVariant, ['product', 'tags']),
   BaseDto,
) {
   @IsMongoId()
   productId: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => CategoryDto)
   tagsDto?: Array<CategoryDto>;
}
