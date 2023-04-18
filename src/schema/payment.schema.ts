import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Invoice } from './invoice.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true })
  invoice: Invoice;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  paymentMethod: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
