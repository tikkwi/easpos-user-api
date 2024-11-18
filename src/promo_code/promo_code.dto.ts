import { IsString } from 'class-validator';
import { FindDto } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';
import { GetBaseAdjustmentQueryDto } from '../price_adjustment/price_adjustment.dto';

export class GetPromoCodeDto extends OmitType(FindDto, ['errorOnNotFound']) {
   @IsString()
   code: string;
}

export class GetAdjustmentWithPromoCodeDto extends GetBaseAdjustmentQueryDto {
   @IsString()
   promoCode: string;
}
