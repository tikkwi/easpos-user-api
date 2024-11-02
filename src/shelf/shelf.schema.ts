import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';
import Section from '../section/section.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';

@Schema()
export default class Shelf extends OmitType(Section, ['stockLocation']) {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Section' })
   section: Section;
}

export const ShelfSchema = SchemaFactory.createForClass(Shelf);
