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

type CreateData = CreatePatientDto;
type UpdateData = UpdatePatientDto;

@Controller('patients')
export class PatientController {
  constructor(private readonly modelService: PatientService) {}

  private async getInstanceOr404(id: number): Promise<PatientModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<PatientModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<PatientModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createPatientDto: CreateData,
  ): Promise<PatientModel | Error> {
    const patientModel: PatientModel = await this.modelService.create(
      createPatientDto,
    );
    if (!patientModel) {
      throw new BadRequestException('Invalid patient!');
    }
    return this.modelService.create(createPatientDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdateData,
  ): Promise<PatientModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PatientModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
