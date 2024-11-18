import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { BaseUser } from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import CustomerTier from '../customer_tier/customer_tier.schema';
import { TimedCredit } from '@common/dto/entity.dto';
import { IsMongoId } from 'class-validator';

class ClaimedPromoCode {
   @IsMongoId()
   promoCode: string;

   @IsMongoId({ each: true })
   usage: Array<string>;
}

export default class Customer extends BaseUser {
   @AppProp({ type: Boolean })
   guest: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'CustomerTier', required: false })
   tier?: AppSchema<CustomerTier>;

   @AppProp({ type: Number, default: 0 })
   cash?: number;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: TimedCredit })
   extensibleCash?: TimedCredit;

   @AppProp({ type: SchemaTypes.Mixed, default: {} })
   timedCash?: Record<number, number>;

   @AppProp({ type: Number, default: 0 })
   point?: number;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: TimedCredit })
   extensiblePoint?: TimedCredit;

   @AppProp({ type: SchemaTypes.Mixed, default: {} })
   timedPoint?: Record<number, number>;

   @AppProp({ type: [SchemaTypes.Mixed], default: [] }, { type: ClaimedPromoCode })
   promoCodes?: Array<ClaimedPromoCode>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
