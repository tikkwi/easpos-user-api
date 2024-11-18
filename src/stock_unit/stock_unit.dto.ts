import { IntersectionType, PickType } from '@nestjs/swagger';
import { FindByIdDto } from '@common/dto/core.dto';
import { ExchangeUnitDto } from '@shared/unit/unit.dto';

export class GetStockLeftDto extends IntersectionType(
   PickType(FindByIdDto, ['id']),
   PickType(ExchangeUnitDto, ['targetId']),
) {}
