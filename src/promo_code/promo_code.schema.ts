import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import APromoCode from '@common/schema/promo_code.schema';
import PriceAdjustment from '../price_adjustment/price_adjustment.schema';
import { Sale } from '../sale/sale.schema';

@Schema()
export default class PromoCode extends APromoCode {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'PriceAdjustment' })
   promotion: PriceAdjustment;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Sale' }] })
   usage: Array<AppSchema<Sale>>;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
