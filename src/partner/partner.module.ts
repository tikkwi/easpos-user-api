import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Partner, { PartnerSchema } from './partner.schema';
import { getGrpcClient, getRepositoryProvider } from '@common/utils/misc';
import { PartnerController } from './partner.controller';
import { MERCHANT } from '@common/constant';
import { ClientsModule } from '@nestjs/microservices';
import PartnerService from './partner.service';

const [clients, providers] = getGrpcClient([MERCHANT]);

@Module({
   imports: [
      ClientsModule.register(clients),
      MongooseModule.forFeature([
         {
            name: Partner.name,
            schema: PartnerSchema,
         },
      ]),
   ],
   controllers: [PartnerController],
   providers: [PartnerService, getRepositoryProvider({ name: Partner.name }), ...providers],
   exports: [PartnerService],
})
export class PartnerModule {}
