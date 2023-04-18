import { User } from 'src/schema/user.schema';
import { Product } from 'src/schema/product.schema';
import { Invoice } from 'src/schema/invoice.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer } from 'src/schema/customer.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    currentUser: User | unknown
  ) {
    const { customer, lineItems } = createInvoiceDto;
    if (!Types.ObjectId.isValid(customer)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const products = await Promise.all(
      lineItems.map(async (item) => {
        const products = await this.productModel.findById(item.product);
        if (!Types.ObjectId.isValid(products['_id'])) {
          throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
        }
        const totalPrice = products.price * item.quantity;
        return {
          product: {
            name: products['name'],
            description: products['description'],
            price: products['price'],
          },
          quantity: item.quantity,
          totalPrice,
        };
      })
    );
    const customerData = await this.customerModel.findById(customer, {
      user: 0,
    });
    const invoice = await this.invoiceModel.create({
      customer: {
        first_name: customerData['first_name'],
        last_name: customerData['last_name'],
        phone_number: customerData['phone_number'],
        id: currentUser['id'],
      },
      user: currentUser['id'],
      lineItems: products,
    });
    return invoice;
  }

  async findAll(currentUser: User | unknown) {
    // await this.invoiceModel.deleteMany({})
    const getInvoices = await this.invoiceModel.find(
      {
        user: currentUser['id'],
      },
      { user: 0 }
    );
    return getInvoices;
  }

  async findOne(id: string, currentUser: User | unknown) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const getInvoice = await this.invoiceModel.findOne(
      { user: currentUser['id'], _id: id },
      { user: 0 }
    );
    if (!getInvoice) {
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
    }
    return getInvoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    currentUser: User | unknown
  ) {
    const getUserInvoice = await this.findOne(id, currentUser);
    const updateInvoice = await this.invoiceModel.findByIdAndUpdate(
      getUserInvoice['id'],
      updateInvoiceDto
    );
    return updateInvoice;
  }

  async remove(id: string, currentUser: User | unknown) {
    const getUserInvoice = await this.findOne(id, currentUser);
    const removeInvoice = await this.invoiceModel.findByIdAndDelete(
      getUserInvoice['id']
    );
    return removeInvoice;
  }

  // async removeInvoiceItem(createInvoiceLineItem: any, currentUser: User|unknown) {
  //   const getUserInvoice = await this.findOne(createInvoiceLineItem['invoiceId'], currentUser)
  //   const currentInvoice = await this.invoiceModel.findByIdAndUpdate(
  //     getUserInvoice['id'],
  //     { $pull: { lineItems: { _id: createInvoiceLineItem.invoiceItemId } } },
  //     { new: true }
  //   );
  //   return currentInvoice;
  // }
}
