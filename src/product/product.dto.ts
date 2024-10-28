import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { CoreDto } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';
import Product from './product.schema';
import { CategoryDto, CreateCategoryDto } from '@common/dto/action.dto';
import { Type } from 'class-transformer';

export class CreateProductDto extends OmitType(CoreDto(Product), ['category', 'tags', 'unit']) {
   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => CategoryDto)
   tags?: CategoryDto[];

   @ValidateNested({ each: true })
   @Type(() => OmitType(CreateCategoryDto, ['type']))
   category: CategoryDto;

   @IsOptional()
   @IsMongoId()
   unitId: string;
}
