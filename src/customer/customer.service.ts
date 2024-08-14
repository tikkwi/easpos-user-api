import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { CustomerServiceMethods, GetUserDto } from '@common/dto/user.dto';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { Customer } from '@common/schema/customer.schema';

@AppService()
export class CustomerService extends CoreService implements CustomerServiceMethods {
   constructor(
      protected readonly context: ContextService,
      @Inject(REPOSITORY) private readonly repository: Repository<Customer>,
   ) {
      super();
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }
}
