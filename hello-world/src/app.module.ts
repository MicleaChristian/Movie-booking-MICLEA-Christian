import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllerController } from './controller/controller.controller';
import { ServiceService } from './service/service.service';
import { ModuleModule } from './module/module.module';
import { UserControllerController } from './user-controller/user-controller.controller';
import { UserServiceService } from './user-service/user-service.service';

@Module({
  imports: [ModuleModule],
  controllers: [AppController, ControllerController, UserControllerController],
  providers: [AppService, ServiceService, UserServiceService],
})
export class AppModule {}
