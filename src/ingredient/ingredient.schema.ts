import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Amount } from '@common/dto/entity.dto';
import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import Product from '../product/product.schema';

class IngredientBlendAmount {
   @IsMongoId()
   productId: string;

   @ValidateNested()
   @Type(() => Amount)
   amount: Amount;
}

@Schema()
export default class Ingredient extends OmitType(Product, [
   'type',
   'inHouse',
   'subType',
   'basePrice',
   'tagPrices',
   'subAllowance',
]) {
   @AppProp({ type: [SchemaTypes.Mixed] }, { type: IngredientBlendAmount })
   blendAmount: IngredientBlendAmount[];
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
