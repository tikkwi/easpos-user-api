import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAppService {
   constructor() {}

   async test() {
      // return await this.appBroker.request(true, (meta) => this.merchantService.tmpTst(meta));
      return 'mingalarbr..';
   }
}
