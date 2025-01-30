import { Matches } from 'class-validator';
import { regex } from '@common/utils/regex';
import { EField } from '@common/utils/enum/misc.enum';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaFactory } from '@nestjs/mongoose';

export default class Field extends BaseSchema {
   @AppProp({ type: String })
   @Matches(regex.fieldName)
   name: string;

   @AppProp({ type: String, enum: EField })
   type: EField;

   @AppProp({ type: Boolean })
   isOptional: boolean;

   @AppProp({ type: Boolean })
   isArray: boolean;

   @AppProp({ type: Number, required: false })
   priority?: number; //NOTE: might use this field to dynamic render custom fields on UI

   @AppProp({ type: String, required: false })
   remark?: string;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
