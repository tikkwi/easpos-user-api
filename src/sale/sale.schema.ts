import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductSale } from '../product_sale/product_sale.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Purchase from '@shared/purchase/purchase.schema';
import PriceAdjustment from '../price_adjustment/price_adjustment.schema';
import Customer from '../customer/customer.schema';

// @Schema()
// export class Sale extends OmitType(ProductSale, ['isPending', 'appliedAdjustment']) {
//    @AppProp({ type: Number })
//    price: number;
//
//    @AppProp({ type: Number })
//    finalPrice: number;
//
//    @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductSale' }] })
//    products: Array<ProductSale>;
//
//    @AppProp({ type: SchemaTypes.ObjectId, ref: 'Unit' })
//    currency: Unit;
//
//    @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
//    paymentMethod: Category;
// }
@Schema()
export class Sale extends Purchase {
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'PriceAdjustment' }], default: [] })
   appliedAdjustments: Array<PriceAdjustment>;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductSale' }] })
   products: Array<ProductSale>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Customer', required: false })
   customer?: Customer;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
