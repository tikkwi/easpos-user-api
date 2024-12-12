import Field from '../field/field.schema';
import Repository from '@common/core/repository';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import ACoreService from '@common/core/core.service';
import { FieldValue } from '@common/dto/entity.dto';
import { EField } from '@common/utils/enum';
import { isDateString, isMongoId, isNumber, isPhoneNumber, isURL } from 'class-validator';
import { isBoolean } from 'lodash';

export default class FieldService extends ACoreService<Field> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Field>) {
      super();
   }

   async validateField({ id, value }: FieldValue) {
      const { data: fieldData } = await this.findById({ id });
      let errMsg = '';
      if (!fieldData.isOptional && !value) errMsg = `${fieldData.name} is required`;
      else
         switch (fieldData.type) {
            case EField.String:
               if (typeof value !== 'string') errMsg = `${fieldData.name} must be a string`;
               break;
            case EField.Id:
               if (!isMongoId(value)) errMsg = `${fieldData.name} must be a valid id`;
               break;
            case EField.Boolean:
               if (!isBoolean(value)) errMsg = `${fieldData.name} must be boolean`;
               break;
            case EField.URL:
               if (!isURL(value)) errMsg = `${fieldData.name} must be a valid url`;
               break;
            case EField.Datetime:
               if (!isDateString(value)) errMsg = `${fieldData.name} must be a valid date string`;
               break;
            case EField.Number:
               if (!isNumber(value)) errMsg = `${fieldData.name} must be a number`;
               break;
            case EField.Phone:
               if (!isPhoneNumber(value)) errMsg = `${fieldData.name} must be a valid phone number`;
               break;
         }
      if (errMsg) throw new BadRequestException(errMsg);
      return { data: null, message: 'Validated successfully' };
   }
}
