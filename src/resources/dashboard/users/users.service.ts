import { User } from './../../../schema/user.schema';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async setAvatar(currentUser: User | unknown, fileName: string) {
    console.log(currentUser);
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      currentUser['_id'],
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

  async currentUser(currentUser) {
    return await this.userModel.findOne({ mobile: currentUser['id'] })
  }
}
