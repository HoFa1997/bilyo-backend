import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';
import { RULES } from 'src/shared/enums/rulesEnums';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ default: null })
  mobile: string;

  @Prop({ default: null })
  otp: number;

  @Prop({ default: null })
  expiresIn: number;

  @Prop({ default: null, required: false })
  avatar: string;

  @Prop({ type: Object, requried: true, default: RULES.MEMBER })
  rules: RULES;

  @Prop({ type: Types.ObjectId, ref: 'Product', default: [] })
  product: Product[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
