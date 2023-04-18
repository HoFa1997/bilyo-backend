import { Product, ProductSchema } from 'src/schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from 'src/schema/invoice.schema';
import { Customer, CustomerSchema } from 'src/schema/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
