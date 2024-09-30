import { IsBoolean, IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '@common/dto/core.dto';

export class AllowanceUsage {
   @IsMongoId()
   allowanceId: string;

   @IsBoolean()
   keep: boolean;
}

export class GetPurchaseAllowanceDto extends BaseDto {
   @IsOptional()
   @IsMongoId()
   customerId?: string;

   @ValidateNested({ each: true })
   @Type(() => AllowanceUsage)
   usages: AllowanceUsage[];
}
