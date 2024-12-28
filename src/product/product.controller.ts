import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import ACoreController from '@common/core/core.controller';
import ProductService from './product.service';

@AppController('product', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class ProductController extends ACoreController {
   constructor(protected readonly service: ProductService) {
      super();
   }
}
