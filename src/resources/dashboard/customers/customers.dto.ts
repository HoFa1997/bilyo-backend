import { PartialType } from '@nestjs/mapped-types';
export class CreateCustomerDto {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  zip_code: string;
  state: string;
  date_of_birth: Date;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  zip_code: string;
  state: string;
  date_of_birth: Date;
  account_balance: number;
  last_interaction_date: Date;
}
