import AppController from '@common/decorator/app_controller.decorator';
import FieldService from './field.service';

@AppController()
export default class FieldController {
   constructor(private readonly service: FieldService) {}
}
