import { OmitType } from '@nestjs/swagger';
import { ProductVariant } from './product_variant.schema';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from '@shared/category/category.dto';

export class CreateProductVariantDto extends OmitType(ProductVariant, ['product', 'tags']) {
   @IsMongoId()
   productId: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => CategoryDto)
   tagsDto?: Array<CategoryDto>;
}
