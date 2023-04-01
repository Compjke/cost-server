import {
  Controller,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Body, Delete, Param, Patch, Post } from '@nestjs/common/decorators';
import { AuthService } from 'src/auth/auth.service';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CostsServise } from './cost.service';
import { CreateCostDto } from './dto/create-costs.dto';
import { UpdateCostDto } from './dto/update-cost.dto';

@Controller('cost')
export class CostController {
  constructor(
    private readonly costService: CostsServise,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JWTGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCosts(@Req() req, @Res() res) {
    const token = req.token;

    const user = await this.authService.getUserByToken(token);

    const costs = await this.costService.getAll();

    const userCosts = costs.filter(
      (cost) => cost.userId === user._id.toString(),
    );

    return res.send(userCosts);
  }

  @UseGuards(JWTGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCost(@Body() CreateCostDto: CreateCostDto, @Req() req) {
    const user = await this.authService.getUserByToken(req.token);

    return await this.costService.createCost({
      ...CreateCostDto,
      userId: user._id as string,
    });
  }

  @UseGuards(JWTGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCost(
    @Body() UpdateCostDto: UpdateCostDto,
    @Param('id') id: string,
  ) {
    return await this.costService.updateCost(UpdateCostDto, id);
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.costService.deleteCost(id);
  }
}
