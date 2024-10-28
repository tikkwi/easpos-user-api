import { Schema } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import { IntersectionType, PickType } from '@nestjs/swagger';
import Expense from '../expense/expense.schema';

@Schema()
export class Sale extends IntersectionType(
   BaseSchema,
   PickType(Expense, ['voucherId', 'amount']),
) {}
