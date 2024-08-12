import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Status } from '@common/dto/entity.dto';
import { Category } from '@shared/category/category.schema';

@Schema()
export class Campaign extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: Boolean, default: false }) //default campaign that will create together with merchant (point shop) and a merchant can only have one campaign that can exchange
   cusExchangeable?: boolean;

   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: Date })
   endDate: Date;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, required: false })
   terms?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   type?: Category;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
