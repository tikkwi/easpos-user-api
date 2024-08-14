import { AppController } from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { PartnerService } from './partner.service';

@AppController('partner', [EAllowedUser.Partner])
export class PartnerController {
   constructor(private readonly service: PartnerService) {}
}
