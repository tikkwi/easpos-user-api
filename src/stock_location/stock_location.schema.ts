import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Amount, Dimension } from '@common/dto/entity.dto';
import { ELocationStatus } from '@common/utils/enum/misc.enum';
import Address from '@shared/address/address.schema';
import { IsPeriod } from '@common/validator';

//Stock location imply both warehouse and store
@Schema()
export default class StockLocation extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: Boolean })
   isWarehouse: boolean;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Dimension })
   allocatedSpace: Dimension;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, required: false })
   remark?: string;

   @AppProp({ type: String })
   @IsEmail()
   mail: string;

   @AppProp({ type: String })
   @IsPhoneNumber()
   mobileNo: string;

   @AppProp({ type: Boolean, required: false })
   requirePermission?: boolean;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   capacity: Amount;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   currentUtilization: Amount;

   @AppProp({ type: String, enum: ELocationStatus })
   status: ELocationStatus;

   @AppProp({ type: String, required: false }, { validators: [{ func: IsPeriod }] })
   operatingSchedule?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Address' })
   address: Address;
}

export const StockLocationSchema = SchemaFactory.createForClass(StockLocation);
