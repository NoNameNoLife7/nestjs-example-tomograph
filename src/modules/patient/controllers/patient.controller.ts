import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PatientService } from '../services';
import {
  CreatePatientDto,
  PatientPaginationDto,
  UpdatePatientDto,
} from '../dto';
import { patient as PatientModel } from '@prisma/client';

@Controller('patient')
export class PatientController {
  constructor(private readonly modelService: PatientService) {}

  private async getInstanceOr404(id: number) {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(@Query() params: PatientPaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patientModel: PatientModel = await this.modelService.create(
      createPatientDto,
    );
    if (!patientModel) throw new BadRequestException('Invalid patient!');
    return this.modelService.create(createPatientDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
