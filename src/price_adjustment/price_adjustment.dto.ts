import { IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { Amount } from '@common/dto/entity.dto';
import {
   AAppliedAdjustmentDto,
   AGetApplicableAdjustmentDto,
   AIsAdjustmentApplicableDto,
} from '@shared/price_adjustment/price_adjustment.dto';
import PriceAdjustment from './price_adjustment.schema';
import { StockDto } from '../stock_unit/stock_unit.dto';

class AppliedAdjustmentDto extends AAppliedAdjustmentDto<PriceAdjustment> {
   focProducts?: Array<StockDto & { stockLeft: Amount }>;
}

export class AppliedAdjustmentsDto {
   promo?: AppliedAdjustmentDto;
   markup?: AppliedAdjustmentDto;
}

export class GetApplicableAdjustmentDto extends AGetApplicableAdjustmentDto {
   @IsOptional()
   @IsMongoId()
   customerId: string;

   //NOTE: if no product, will query for wholesale adjustments
   @ValidateIf((o) => !o.salePrice)
   @IsMongoId()
   productId?: string;

   //NOTE: pass base unit to avoid multiple queries
   @ValidateIf((o) => !!o.productId)
   quantity?: number;

   @ValidateIf((o) => !o.productId)
   appliedProductAdjustments?: boolean;
}

export class IsAdjustmentApplicableDto extends AIsAdjustmentApplicableDto {
   @IsOptional()
   @IsMongoId()
   customerId: string;
}
