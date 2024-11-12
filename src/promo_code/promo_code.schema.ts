import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';
import StockLocation from '../stock_location/stock_location.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Dimension } from '@common/dto/entity.dto';

@Schema()
export default class Section extends OmitType(StockLocation, [
   'mail',
   'isWarehouse',
   'mobileNo',
   'operatingSchedule',
   'address',
]) {
   //NOTE: at stock_location
   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Dimension })
   position: Dimension;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'StockLocation' })
   stockLocation: StockLocation;
}

export const Promo_codeSchema = SchemaFactory.createForClass(Section);
