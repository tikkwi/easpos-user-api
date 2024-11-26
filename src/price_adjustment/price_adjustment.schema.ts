import { Schema } from '@nestjs/mongoose';
import APriceAdjustment from '@common/schema/price_adjustment.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { EPriceAdjustment } from '@common/utils/enum';
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

class FocStock {
   @IsMongoId()
   stockId: string;

   @ValidateIf((o) => !o.amountPerTarget)
   @ValidateNested()
   @Type(() => Amount)
   quantity: Amount;
}

export class Adjustment {
   @AppProp({ type: Boolean })
   isMarkup: boolean;

   @IsBoolean()
   applyWholeSale: boolean;

   //TODO:focStocks' unit must be same with target's unit
   @ValidateIf((o) => !o.applyWholeSale)
   @IsOptional()
   @IsMongoId({ each: true })
   focStocksWithTargetAmount?: string[]; //NOTE: buy 3 cup, foc 3 plate etc.

   //TODO:focStocks' unit must be same with target's unit
   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => FocStock)
   focStocks?: FocStock[];

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
   @AppProp({ type: [String], enum: EPriceAdjustment })
   types: EPriceAdjustment[];

   @AppProp({ type: SchemaTypes.Mixed }, { type: Adjustment })
   adjustment: Adjustment;

   @ValidateIf((o) => !o.applyWholeSale)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductVariant' }] })
   adjustedProducts: Array<AppSchema<ProductVariant>>;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Bundle) && o.applyWholeSale)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'StockUnit' }] })
   bundleTrigger?: StockUnit[];

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Tier))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'StockUnit' }] })
   tierTrigger?: CustomerTier;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.StockLevelHigher))
   @AppProp({ type: Number })
   @Min(1)
   stockLevelHigherTrigger?: number; //NOTE: base unit

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.StockLevelLower))
   @AppProp({ type: Number })
   @Min(1)
   stockLevelLowerTrigger?: number; //NOTE: base unit

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Volume))
   @AppProp({ type: Number })
   @Min(1)
   volumeTrigger?: number; //NOTE: base unit

   @ValidateIf((o) => !o.applyWholeSale)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductVariant' }] })
   appliedProducts?: Array<AppSchema<ProductVariant>>;
}
