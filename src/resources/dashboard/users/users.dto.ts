import { Product } from './../../../schema/product.schema';
import { RULES } from './../../../shared/enums/rulesEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  name: string;
  password: string;
  email: string;
  mobile: string;
  otp: number;
  expiresIn: number;
  avatar: string;
  rules: RULES;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {
  name: string;
  password: string;
  email: string;
  mobile: string;
  otp: number;
  expiresIn: number;
  avatar: string;
  rules: RULES;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}
