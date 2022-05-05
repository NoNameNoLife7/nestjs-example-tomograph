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
import { PatientService } from '../services';
import { CreatePatientDto, UpdatePatientDto } from '../dto';
import { patient as PatientModel } from '@prisma/client';

@Controller('patient')
export class PatientController {
  constructor(private readonly modelService: PatientService) {}

  private async getInstanceOr404(id: number): Promise<PatientModel> {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<PatientModel | null> {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<PatientModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<PatientModel> {
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
  ): Promise<PatientModel> {
    if (!+id) throw new NotFoundException();
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PatientModel> {
    if (!+id) throw new NotFoundException();
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
