import { PartialType } from '@nestjs/mapped-types';

export class CreatePlanDto {}
export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
