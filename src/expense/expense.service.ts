import AppService from '@common/decorator/app_service.decorator';
import Expense from './expense.schema';
import ACoreService from '@common/core/core.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';

@AppService()
export default class ExpenseService extends ACoreService<Expense> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Expense>) {
      super();
   }
}
