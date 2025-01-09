import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import ProductService from './product.service';

@AppController('product', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class ProductController {
   constructor(protected readonly service: ProductService) {}
}
