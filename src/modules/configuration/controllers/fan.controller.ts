import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FanService } from '../../patient/services';
import { CreateVentilatorDto, UpdateVentilatorDto } from '../../patient/dto';
import { ventilator as VentilatorModel } from '@prisma/client';

type CreateData = CreateVentilatorDto;
type UpdateData = UpdateVentilatorDto;

@Controller('ventilators')
export class FanController {
  constructor(private readonly modelService: FanService) {}

  private async getInstanceOr404(id: number): Promise<VentilatorModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<VentilatorModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<VentilatorModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createVentilatorDto: CreateData,
  ): Promise<VentilatorModel | Error> {
    const ventilatorModel: VentilatorModel = await this.modelService.create(
      createVentilatorDto,
    );
    if (!ventilatorModel) {
      throw new BadRequestException('Invalid ventilator!');
    }
    return this.modelService.create(createVentilatorDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVentilatorDto: UpdateData,
  ): Promise<VentilatorModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateVentilatorDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<VentilatorModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
