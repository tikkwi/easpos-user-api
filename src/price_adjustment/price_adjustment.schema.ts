import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import { EPriceAdjustment } from '@common/utils/enum/misc.enum';
import { SchemaTypes } from 'mongoose';
import {
   IsBoolean,
   IsMongoId,
   IsOptional,
   Max,
   Min,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import StockUnit from '../stock_unit/stock_unit.schema';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';
import CustomerTier from '../customer_tier/customer_tier.schema';
import { ProductVariant } from '../product_variant/product_variant.schema';
import APriceAdjustment from '@shared/price_adjustment/price_adjustment.schema';

class FocStock {
   @IsMongoId()
   stockId: string;

   @ValidateIf((o) => !o.targetAmount)
   @ValidateNested()
   @Type(() => Amount)
   quantity?: Amount;

   //NOTE: for this option stock unit must be exchangeable with target's unit
   @ValidateIf((o) => !o.quantity)
   @IsBoolean()
   targetAmount?: boolean;
}

export class Adjustment {
   //TODO: focStocks' will only be available
   // up to stock left. If merchant wanna give cash back, apply discount.
   @IsOptional()
   @ValidateNested()
   @Type(() => FocStock)
   focStock?: FocStock;

   @IsOptional()
   @IsBoolean()
   isPercentage?: boolean;

   @ValidateIf((o) => o.isPercentage)
   @Min(0.001)
   @Max(100)
   percentageAdjustment?: number;

   @IsOptional()
   @Min(0.001)
   @Max(100)
   absoluteAdjustment?: number;
}

@Schema()
export default class PriceAdjustment extends APriceAdjustment {
   @AppProp({ type: Boolean })
   applyWholeSale: boolean;

   //NOTE: stackable mean whole adj can still apply if there are already product adjustments(only 1 whole adj can apply)..
   @AppProp({ type: Boolean, default: false })
   stackable: boolean;

   @AppProp({ type: [String], enum: EPriceAdjustment })
   types: EPriceAdjustment[];

   @AppProp({ type: SchemaTypes.Mixed }, { type: Adjustment })
   adjustment: Adjustment;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Bundle) && o.applyWholeSale)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'StockUnit' }] })
   bundleTrigger?: StockUnit[];

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Tier))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'StockUnit' }] })
   tierTrigger?: CustomerTier;

   @ValidateIf((o) => !o.applyWholeSale && o.types.includes(EPriceAdjustment.StockLevelHigher))
   @AppProp({ type: Number })
   @Min(1)
   stockLevelHigherTrigger?: number; //NOTE: base unit

   @ValidateIf((o) => !o.applyWholeSale && o.types.includes(EPriceAdjustment.StockLevelLower))
   @AppProp({ type: Number })
   @Min(1)
   stockLevelLowerTrigger?: number; //NOTE: base unit

   @ValidateIf((o) => !o.applyWholeSale && o.types.includes(EPriceAdjustment.Volume))
   @AppProp({ type: Number })
   @Min(1)
   volumeTrigger?: number; //NOTE: base unit

   @ValidateIf((o) => !o.applyWholeSale)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductVariant' }] })
   appliedProducts?: Array<ProductVariant>;
}

export const PriceAdjustmentSchema = SchemaFactory.createForClass(PriceAdjustment);
