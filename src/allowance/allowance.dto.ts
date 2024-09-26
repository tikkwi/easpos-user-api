import { GetApplicableAllowanceDto } from '@shared/allowance/allowance.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class GetPurchaseAllowanceDto extends GetApplicableAllowanceDto {
   @IsOptional()
   @IsMongoId()
   customerId?: string;
}
