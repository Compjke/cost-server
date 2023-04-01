import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Cost, CostSchema } from 'src/schemas/costs.schema';
import { CostController } from './cost.controller';
import { CostsServise } from './cost.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cost.name, schema: CostSchema }]),
    AuthModule,
  ],
  providers: [CostsServise],
  controllers: [CostController],
})
export class CostModule {}
