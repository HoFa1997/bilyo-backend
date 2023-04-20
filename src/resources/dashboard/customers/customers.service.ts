import { User } from 'src/schema/user.schema';
import { Customer } from './../../../schema/customer.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from 'src/shared/interface/user';
import { responseGenerator } from 'src/shared/utils/responseGenerator';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findUserByID(user: IUser) {
    return await this.userModel.findOne({mobile: user.id})
  }

  async create(createCustomerDto: CreateCustomerDto, user: IUser) {
    const userAdd = await this.findUserByID(user);
    const customer = await this.customerModel.create({
      ...createCustomerDto,
      user: userAdd._id,
    });
    return responseGenerator(`${customer._id}`, 'customer created');
  }

  async findAll(user: IUser) {
    const { _id } = await this.findUserByID(user);
    const customers = await this.customerModel.find({ user: _id });
    return customers;
  }

  async findOne(id: string, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const { _id } = await this.findUserByID(user);
    const customer = await this.customerModel.find(
      { user: _id, _id: id },
      { user: 0 },
    );
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const { _id } = await this.findUserByID(user);
    const customer = await this.customerModel.findOne({ user: _id, _id: id });
    const updatedCustomer = await this.customerModel.findByIdAndUpdate(
      customer._id,
      updateCustomerDto,
    );
    return responseGenerator(`${updatedCustomer._id}`, 'customer updated');
  }

  async remove(id: string, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const { _id } = await this.findUserByID(user);
    const customer = await this.customerModel.findOne({ user: _id, _id: id });
    const removeCustomer = await this.customerModel.findByIdAndDelete(
      customer._id,
    );
    return responseGenerator(`${removeCustomer._id}`, 'customer deleted');
  }
}
