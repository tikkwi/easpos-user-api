import { OmitType } from '@nestjs/swagger';
import Expense from './expense.schema';
import { IsMongoId, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import { EExpenseScope } from '@common/utils/enum';
import { Type } from 'class-transformer';
import { CoreDto } from '@common/dto/core.dto';

class ProductCostContribution {
   @IsMongoId()
   id: string;

   @Min(0.0001)
   @Max(0.99)
   percent: number;
}

export class CreateExpenseDto extends OmitType(CoreDto(Expense), [
   'effectiveProducts',
   'contributionPercent',
]) {
   @ValidateIf((o) => o.scope !== EExpenseScope.WholeBusiness)
   @ValidateNested({ each: true })
   @Type(() => ProductCostContribution)
   products: Array<ProductCostContribution>;
}
