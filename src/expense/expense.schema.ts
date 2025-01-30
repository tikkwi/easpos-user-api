import { SchemaTypes } from 'mongoose';
import { EExpense, EExpenseScope } from '@common/utils/enum/misc.enum';
import { Max, Min, ValidateIf } from 'class-validator';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '@shared/category/category.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Amount } from '@common/dto/entity.dto';
import { ProductVariant } from '../product_variant/product_variant.schema';

@Schema()
export default class Expense extends BaseSchema {
   @AppProp({ type: String, required: false })
   voucherId?: string;

   @AppProp({ type: String, enum: EExpense })
   type: EExpense;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: Category;

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

   @ValidateIf((o) => o.scope !== EExpenseScope.WholeBusiness)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductVariant' }] })
   effectiveProducts?: Array<ProductVariant>;

   //TODO: validate align with effectiveProducts (dto must also be {id, percent})
   @ValidateIf((o) => o.scope !== EExpenseScope.WholeBusiness)
   @AppProp({ type: [Number] })
   @Min(0.0001)
   @Max(0.99)
   contributionPercent: Array<number>;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
