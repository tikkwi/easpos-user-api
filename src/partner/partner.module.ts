import { Module } from '@nestjs/common';
import { PartnerSchema } from './partner.schema';
import { getGrpcClient } from '@common/utils/misc';
import { PartnerController } from './partner.controller';
import { MERCHANT, SCHEMA } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import PartnerService from './partner.service';
import AddressModule from '@shared/address/address.module';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [ClientsModule.register(clients), AddressModule],
   controllers: [PartnerController],
   providers: [PartnerService, { provide: SCHEMA, useValue: PartnerSchema }, ...providers],
   exports: [PartnerService],
})
export class PartnerModule {}
