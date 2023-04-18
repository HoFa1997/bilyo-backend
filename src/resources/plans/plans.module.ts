import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plans, PlansSchema } from 'src/schema/plans.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plans.name, schema: PlansSchema }]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
