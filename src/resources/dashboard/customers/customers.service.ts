import { User } from 'src/schema/user.schema';
import { Customer } from './../../../schema/customer.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    currentUser: User | unknown
  ) {
    const getCustomers = await this.customerModel.create({
      ...createCustomerDto,
      user: currentUser['_id'],
    });

    return getCustomers;
  }

  async findAll(currentUser: User | unknown) {
    const getCustomers = await this.customerModel.find(
      {
        user: currentUser['_id'],
      },
      { user: 0 }
    );
    return getCustomers;
  }

  async findOne(id: string, currentUser: User | unknown) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const getCustomer = await this.customerModel.findOne(
      { user: currentUser['_id'], _id: id },
      { user: 0 }
    );
    if (!getCustomer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return getCustomer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    currentUser: User | unknown
  ) {
    const getUserCustomer = await this.findOne(id, currentUser);

    const updatedCustomer = await this.customerModel.findByIdAndUpdate(
      getUserCustomer['_id'],
      updateCustomerDto
    );
    return updatedCustomer;
  }

  async remove(id: string, currentUser: User | unknown) {
    const getUserCustomer = await this.findOne(id, currentUser);
    const removeCustomer = await this.customerModel.findByIdAndDelete(
      getUserCustomer['_id']
    );
    return removeCustomer;
  }
}
