import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { mongooseConfig } from './../shared/utils/constant';
export type PlanDocument = HydratedDocument<Plans>;

@Schema(mongooseConfig)
export class Plans {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    options: string[]
}

export const PlansSchema = SchemaFactory.createForClass(Plans);
