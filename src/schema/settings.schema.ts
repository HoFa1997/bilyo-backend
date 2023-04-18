import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { mongooseConfig } from './../shared/utils/constant';
export type SettingsDocument = HydratedDocument<Settings>;

@Schema(mongooseConfig)
export class Tax {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ default: false })
  isFlatFee: boolean;

  @Prop()
  flatFeeAmount: number;
}

@Schema()
export class Discount {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ default: false })
  isFlatFee: boolean;

  @Prop()
  flatFeeAmount: number;
}

@Schema()
export class Settings {
  @Prop([Tax])
  defaultTaxRates: Tax[];

  @Prop([Discount])
  defaultDiscountRates: Discount[];

  @Prop()
  invoiceTemplate: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
