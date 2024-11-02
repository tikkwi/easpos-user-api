import { SchemaTypes } from 'mongoose';
import { EExpenseScope } from '@common/utils/enum';
import { ValidateIf } from 'class-validator';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '@shared/category/category.schema';
import Product from '../product/product.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Amount } from '@common/dto/entity.dto';

@Schema()
export default class Expense extends BaseSchema {
   @AppProp({ type: String, required: false })
   voucherId?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   amount: Amount;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   taxAmount: Amount; //NOTE: Inclusive

   @AppProp({ type: Boolean })
   isTax: boolean;

   @AppProp({ type: String, required: false })
   remark?: string;

   @AppProp({ type: [String] })
   attachments?: string[];

   @AppProp({ type: String, enum: EExpenseScope })
   scope: EExpenseScope;

   @ValidateIf((o) => o.scope === EExpenseScope.ProductCategory)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   eftProdCategories: AppSchema<Category>[];

   @ValidateIf((o) => o.scope === EExpenseScope.ProductTag)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   eftProdTags: AppSchema<Category>[];

   @ValidateIf((o) => o.scope === EExpenseScope.WholeProduct)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Product' }] })
   eftWhlProds: AppSchema<Product>[];

   @ValidateIf((o) => o.scope === EExpenseScope.PerUnitProduct)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Product' }] })
   eftPerUntProds: AppSchema<Product>[];
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
