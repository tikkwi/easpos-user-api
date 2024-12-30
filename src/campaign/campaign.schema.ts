import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base/base.schema';
import Category from '@shared/category/category.schema';
import { EStatus } from '@common/utils/enum';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export default class Campaign extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: Boolean, default: false }) //default campaign that will create together with merchant (point shop) and a merchant can only have one campaign that can exchange
   cusExchangeable?: boolean;

   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: Date })
   endDate: Date;

   @AppProp({ type: String, enum: EStatus })
   status: EStatus;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, required: false })
   terms?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   type?: AppSchema<Category>;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
