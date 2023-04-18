import { Model, Types } from 'mongoose';
import { User } from './../../../schema/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { Product } from 'src/schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, user: unknown | User) {
    const createdUser = await this.productModel.create({
      ...createProductDto,
      user: user['_id'],
    });

    return createdUser;
  }

  async findAll(user: User | unknown) {
    const getUserProducts: Product[] = await this.productModel.find(
      {
        user: user['_id'],
      },
      { user: 0 },
    );
    return getUserProducts;
  }

  async findOne(id: string, user: User | unknown) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const getUserProduct: Product = await this.productModel.findOne(
      { user: user['_id'], _id: id },
      { user: 0 },
    );
    if (!getUserProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return getUserProduct;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User | unknown,
  ) {
    const getUserProduct = await this.findOne(id, user);

    const updatedProduct: Product = await this.productModel.findByIdAndUpdate(
      getUserProduct['_id'],
      updateProductDto,
    );
    return updatedProduct;
  }

  async remove(id: string, user: User | unknown) {
    const getUserProduct = await this.findOne(id, user);
    const deleteUserProduct: Product =
      await this.productModel.findByIdAndDelete(getUserProduct['_id']);
    return deleteUserProduct;
  }
}
