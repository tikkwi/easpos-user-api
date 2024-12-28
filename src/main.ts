import { AppModule } from './app.module';
import appBootstrap from '@common/utils/bootstrap';

async function bootstrap() {
   await appBootstrap(AppModule, 4002);
}

bootstrap();
