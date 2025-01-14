import { IntersectionType } from '@nestjs/swagger';
import { BaseDto } from '@common/dto/core.dto';
import { FieldValue } from '@common/dto/entity.dto';

export class ValidateFieldDto extends IntersectionType(BaseDto, FieldValue) {}
