import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { MangooseConfigService } from './config/MangooseConfig';
import { CostModule } from './costs/cost.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MangooseConfigService,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    CostModule,
  ],
})
export class AppModule {}
