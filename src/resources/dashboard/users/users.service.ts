import { User } from './../../../schema/user.schema';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUser(currentUser: User | unknown, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      currentUser['id'],
      updateUserDto,
    );
    return updatedUser;
  }

  async setAvatar(currentUser: User | unknown, fileName: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      currentUser['id'],
      { avatar: fileName },
    );
    return updatedUser;
  }

  async removeAvatar(currentUser: User | unknown) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      currentUser['id'],
      { avatar: null },
    );
    return updatedUser;
  }
}
