import { mongooseConfig } from './../shared/utils/constant';
import { User } from 'src/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema(mongooseConfig)
export class Customer {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zip_code: string;

  @Prop({ default: null })
  date_of_birth: string;

  @Prop({ default: 0 })
  account_balance: number;

  @Prop({ required: false })
  last_interaction_date: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: [] })
  user: User;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
