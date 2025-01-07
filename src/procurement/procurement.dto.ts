import { IntersectionType, OmitType } from '@nestjs/swagger';
import Procurement from './procurement.schema';
import { IsMongoId } from 'class-validator';
import { BaseDto } from '@common/dto/core.dto';

export class CreateProcurementDto extends IntersectionType(
   BaseDto,
   OmitType(Procurement, ['supplier', 'expenses', 'status']),
) {
   @IsMongoId()
   supplierId: string;

   @IsMongoId({ each: true })
   expenseIds: Array<string>;
}
