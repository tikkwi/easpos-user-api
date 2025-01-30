import { EAllowedUser } from '@common/utils/enum/misc.enum';
import PartnerService from './partner.service';
import AppController from '@common/decorator/app_controller.decorator';

@AppController('partner', [EAllowedUser.Partner])
export class PartnerController {
   constructor(private readonly service: PartnerService) {}
}
