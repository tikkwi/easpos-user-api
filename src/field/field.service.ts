import Field from '../field/field.schema';
import { BadRequestException } from '@nestjs/common';
import BaseService from '@common/core/base/base.service';
import { EField } from '@common/utils/enum/misc.enum';
import { isDateString, isMongoId, isNumber, isPhoneNumber, isURL } from 'class-validator';
import { isBoolean } from 'lodash';
import { ValidateFieldDto } from './field.dto';
import { ModuleRef } from '@nestjs/core';

export default class FieldService extends BaseService<Field> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }

   async validateField({ ctx, id, value }: ValidateFieldDto) {
      const { data: fieldData } = await this.findById({ ctx, id });
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
