import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { IsNumber, Max, Min } from 'class-validator';
import { SchemaTypes } from 'mongoose';

function AdjPriority() {
   return function (target: any, key: string) {
      IsNumber()(target, key);
      Min(1)(target, key);
      Max(9)(target, key);
   };
}

class AdjustmentPriority {
   @AdjPriority()
   stockLevelLower: number;

   @AdjPriority()
   stockLevelHigher: number;

   @AdjPriority()
   volume: number;

   @AdjPriority()
   time: number;

   @AdjPriority()
   tier: number;

   @AdjPriority()
   bundle: number;

   @AdjPriority()
   spend: number;

   @AdjPriority()
   paymentMethod: number;

   @AdjPriority()
   currency: number;
}

@Schema()
export default class MerchantConfig extends BaseSchema {
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

   @AppProp({ type: Boolean, default: false })
   requirePayrollApprove: boolean;

   @AppProp(
      {
         type: SchemaTypes.Mixed,
         default: {
            time: 1,
            stockLevelLower: 2,
            stockLevelHigher: 3,
            volume: 4,
            spend: 5,
            tier: 6,
            bundle: 7,
            paymentMethod: 8,
            currency: 9,
         },
      },
      { type: AdjustmentPriority },
   )
   adjustmentPriority: AdjustmentPriority;
}

export const MerchantConfigSchema = SchemaFactory.createForClass(MerchantConfig);
