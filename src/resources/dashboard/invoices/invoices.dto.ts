import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceDto {
  customer: string;
  user: string;
  lineItems: {
    product: string;
    quantity: number;
  }[];
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  //   invoiceNumber: string;
  //   customer: Customer;
  //   date: Date;
  //   dueDate: Date;
  //   lineItems: InvoiceLineItem[];
  //   status: STATUS;
  //   totalAmount: number;
}

export class CreateInvoiceLineItemDto {
  invoiceID: string;
  productID: string;
}
