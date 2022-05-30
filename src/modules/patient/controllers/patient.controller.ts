import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PatientService } from '../services';
import {
  CreatePatientDto,
  PatientPaginationDto,
  PatientRelation,
  UpdatePatientDto,
} from '../dto';
import { patient as PatientModel } from '@prisma/client';

@Controller('patient')
export class PatientController {
  constructor(private readonly modelService: PatientService) {}

  private async getInstanceOr404(id: number, params: PatientRelation) {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: PatientRelation,
  ) {
    return this.getInstanceOr404(+id, params);
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
    return patientModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.modelService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }
}
