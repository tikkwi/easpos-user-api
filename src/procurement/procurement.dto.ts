import { OmitType } from '@nestjs/swagger';
import Procurement from './procurement.schema';
import { IsMongoId } from 'class-validator';

export class CreateProcurementDto extends OmitType(Procurement, [
   'supplier',
   'expenses',
   'status',
]) {
   @IsMongoId()
   supplierId: string;

   @IsMongoId({ each: true })
   expenseIds: Array<string>;
}
