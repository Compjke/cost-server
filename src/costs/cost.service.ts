import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cost, CostsDocument } from 'src/schemas/costs.schema';
import { CreateCostDto } from './dto/create-costs.dto';
import { UpdateCostDto } from './dto/update-cost.dto';

@Injectable()
export class CostsServise {
  constructor(
    @InjectModel(Cost.name) private costsModel: Model<CostsDocument>,
  ) {}

  async getAll(): Promise<Cost[]> {
    return this.costsModel.find();
  }

  async getOne(id: string): Promise<Cost> {
    return this.costsModel.findOne({ _id: id });
  }

  async createCost(CreateCostDto: CreateCostDto): Promise<Cost> {
    const createdCost = new this.costsModel(CreateCostDto);
    return createdCost.save();
  }

  async updateCost(UpdateCostDto: UpdateCostDto, id: string): Promise<Cost> {
    await this.costsModel.updateOne(
      { _id: id },
      {
        $set: {
          ...UpdateCostDto,
        },
      },
    );
    return this.getOne(id);
  }

  async deleteCost(id: string): Promise<void> {
    await this.costsModel.deleteOne({ _id: id });
  }
}
