import { join } from 'path';
import { responseGenerator } from 'src/shared/utils/responseGenerator';
import { User } from './../../../schema/user.schema';
import { Controller, Body, Patch, Param, UseGuards, Req, HttpException, HttpStatus, Get, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles, UseInterceptors, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './users.dto';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs'

@Controller('dashboard/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('avatar')
  @UseInterceptors(FilesInterceptor('avatar'))
  @UseInterceptors()
  async setAvatar(@Req() req, @UploadedFiles(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ]
    })
  ) avatar: Express.Multer.File) {
    const currentUser = req.user as User as unknown;

    if(!fs.existsSync('packages/backend/public/uploads')) {
      fs.mkdirSync('packages/backend/public/uploads', { recursive: true })
    }

    if(currentUser['avatar']) {
      const currentImage = currentUser['avatar'].split('/')
      fs.unlinkSync(`packages/backend/public/uploads/${currentImage[currentImage.length - 1]}`)
      await this.usersService.removeAvatar(currentUser)
    }

    const originName = avatar[0].originalname.split(" ").join('-')
    const timeStamp = new Date().getTime()
    const fileName = `${timeStamp}-${originName}`
    fs.writeFileSync(`packages/backend/public/uploads/${fileName}`, avatar[0].buffer)

    if(!currentUser) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const currentHostPath = `${req.protocol}://${req.get('Host')}/uploads/${fileName}`
    await this.usersService.setAvatar(currentUser, currentHostPath) 
    return responseGenerator(currentUser['id'], 'user avatar created')
  }

  @Patch('edit')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const currentUser = req.user as User as unknown;
    if(!currentUser) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const updatedUser = await this.usersService.updateUser(currentUser, updateUserDto);
    return responseGenerator(updatedUser['id'], "user updated")
  }

  @Get()
  async currentUser(@Req() req) {
    return req.user;
  }
}