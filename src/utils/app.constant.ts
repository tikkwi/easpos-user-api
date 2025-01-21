import { BranchSchema } from '../branch/branch.schema';
import { CustomerSchema } from '../customer/customer.schema';
import { CustomerTierSchema } from '../customer_tier/customer_tier.schema';
import { FieldSchema } from '../field/field.schema';
import { InspectionSchema } from '../inspection/inspection.schema';
import { MerchantConfigSchema } from '../merchant_config/merchant_config.schema';
import { PartnerSchema } from '../partner/partner.schema';
import { PayrollSchema } from '../payroll/payroll.schema';
import { PayrollAdjustmentSchema } from '../payroll_adjustment/payroll_adjustment.schema';
import { PriceAdjustmentSchema } from '../price_adjustment/price_adjustment.schema';
import { ProcurementSchema } from '../procurement/procurement.schema';
import { ProductSchema } from '../product/product.schema';
import { ProductSaleSchema } from '../product_sale/product_sale.schema';
import { ProductVariantSchema } from '../product_variant/product_variant.schema';
import { PromoCodeSchema } from '../promo_code/promo_code.schema';
import { SaleSchema } from '../sale/sale.schema';
import { SampleRecordSchema } from '../sample_record/sample_record.schema';
import { SectionSchema } from '../section/section.schema';
import { ShelfSchema } from '../shelf/shelf.schema';
import { StockLocationSchema } from '../stock_location/stock_location.schema';
import { StockUnitSchema } from '../stock_unit/stock_unit.schema';
import { Schema } from 'mongoose';
import { EmployeeSchema } from '../employee/employee.schema';
import { EmployeeRoleSchema } from '../employee_role/employee_role.schema';
import { RequestMethod } from '@nestjs/common';
import { SHARED_SCHEMAS } from '@common/constant/app.constant';

export const APP_SCHEMAS: Array<[string, Schema]> = [
   ...SHARED_SCHEMAS,
   ['Branch', BranchSchema],
   ['Customer', CustomerSchema],
   ['Employee', EmployeeSchema],
   ['EmployeeRole', EmployeeRoleSchema],
   ['CustomerTier', CustomerTierSchema],
   ['Field', FieldSchema],
   ['Inspection', InspectionSchema],
   ['MerchantConfig', MerchantConfigSchema],
   ['Partner', PartnerSchema],
   ['Payroll', PayrollSchema],
   ['PayrollAdjustment', PayrollAdjustmentSchema],
   ['PriceAdjustment', PriceAdjustmentSchema],
   ['Procurement', ProcurementSchema],
   ['Product', ProductSchema],
   ['ProductSale', ProductSaleSchema],
   ['ProductVariant', ProductVariantSchema],
   ['PromoCode', PromoCodeSchema],
   ['Sale', SaleSchema],
   ['SampleRecord', SampleRecordSchema],
   ['Section', SectionSchema],
   ['Shelf', ShelfSchema],
   ['StockLocation', StockLocationSchema],
   ['StockUnit', StockUnitSchema],
];

export const BASIC_AUTH_PATHS = [
   { path: '/test', method: RequestMethod.GET },
   { path: '/create-merchant', method: RequestMethod.POST },
   { path: '/employee/login', method: RequestMethod.POST },
];
