import BaseSchema from '@common/core/base.schema';

export default abstract class Promotion extends BaseSchema() {
   abstract benefit: any;
}
