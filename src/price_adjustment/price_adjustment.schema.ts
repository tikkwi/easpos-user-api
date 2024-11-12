import { Schema } from '@nestjs/mongoose';
import APriceAdjustment from '@common/schema/price_adjustment.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { EPriceAdjustment } from '@common/utils/enum';
import { SchemaTypes } from 'mongoose';
import { ValidateIf } from 'class-validator';
import StockUnit from '../stock_unit/stock_unit.schema';

@Schema()
export default class PriceAdjustment extends APriceAdjustment {
   @AppProp({ type: [String], enum: EPriceAdjustment })
   types: EPriceAdjustment[];

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Bundle))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'StockUnit' }] })
   bundleTrigger?: StockUnit[];

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Tier))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'StockUnit' }] })
   tierTrigger?: StockUnit[];
}
