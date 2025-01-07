import { IsString } from 'class-validator';
import { BaseDto, FindDto } from '@common/dto/core.dto';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import { GetBaseAdjustmentQueryDto } from '../price_adjustment/price_adjustment.dto';

export class GetPromoCodeDto extends OmitType(FindDto, ['errorOnNotFound']) {
   @IsString()
   code: string;
}

export class GetAdjustmentWithPromoCodeDto extends IntersectionType(
   BaseDto,
   GetBaseAdjustmentQueryDto,
) {
   @IsString()
   promoCode: string;
}
