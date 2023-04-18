import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Customer } from './customer.schema';
import { STATUS } from 'src/shared/enums/invoiceStatus';
import { Product } from './product.schema';
import { generateUniqueId } from 'src/shared/utils/uniqIdGenerator';

import { User } from './user.schema';
export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class InvoiceLineItem {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;
}

@Schema()
export class Invoice {
  @Prop({ default: () => generateUniqueId() })
  invoiceNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer;

  @Prop({ required: true, default: () => Date.now() })
  date: Date;

  @Prop({
    type: Date,
    default: () => Date.now() + 3 * 24 * 60 * 60 * 1000,
  })
  dueDate: Date;

  @Prop([InvoiceLineItem])
  lineItems: InvoiceLineItem[];

  @Prop({ type: Object, enum: STATUS, default: STATUS.UNPAID })
  status: string;

  @Prop({ required: false, default: 0 })
  totalAmount: number;
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
