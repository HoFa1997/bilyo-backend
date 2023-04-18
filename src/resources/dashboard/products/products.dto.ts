import { PartialType } from '@nestjs/mapped-types';
import * as Joi from 'joi';

export const ProductValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  categories: Joi.array().items(Joi.string()),
  qty: Joi.number()
});

export class CreateProductDto {
  name: string;
  user: string;
  description: string;
  categories: string[];
  qty:number
  price: number;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {
  name: string;
  user: string;
  description: string;
  categories: string[];
  qty:number
  price: number;
}
