import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';

/*
 * NOTE:
 * Difference between point and cash
 *  The real merchant currency is point. Cash are there for those that wanna support cash withdraw by affiliate
 * marketing, for some campaign that wanna give withdrawal benefit and reloading cash to buy point. All usage inside merchant (buy, point shop etc.)
 * will be done by point. The only usage that can do with cash is buying point..
 */

@Schema()
export class MerchantConfig extends BaseSchema {
   @AppProp({ type: Boolean, default: false })
   mUsrMobileM: boolean;

   @AppProp({ type: Boolean, default: false })
   mUsrAddressM: boolean;

   @AppProp({ type: Boolean, default: false })
   cusMobileM: boolean;

   @AppProp({ type: Boolean, default: false })
   cusAddressM: boolean;

   @AppProp({ type: Boolean, default: false })
   parAddressM: boolean;

   @AppProp({ type: Boolean, default: true })
   extCusPoint: boolean; // NOTE: will extend customer point to the longest benefit

   @AppProp({ type: Boolean, default: true })
   extCusCash: boolean; // NOTE: will extend customer cash to the longest benefit

   @AppProp({ type: Number, default: 1 })
   pointPrice: number;

   @AppProp({ type: Boolean, default: false })
   pointExchange: boolean;
}

export const MerchantConfigSchema = SchemaFactory.createForClass(MerchantConfig);
