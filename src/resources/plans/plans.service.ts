import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plans } from 'src/schema/plans.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlansService {
  constructor(@InjectModel(Plans.name) private PlanModel: Model<Plans>) {}

  async findAll() {
    const allPlans = await this.PlanModel.find();
    return allPlans;
  }

  async findOne(id: string) {
    const plan = await this.PlanModel.findById(id);
    return plan;
  }
}
