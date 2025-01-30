import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import PriceAdjustment from '../price_adjustment/price_adjustment.schema';
import APromoCode from '@shared/promo_code/promo_code.schema';

@Schema()
export default class PromoCode extends APromoCode {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'PriceAdjustment' })
   promotion: PriceAdjustment;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
