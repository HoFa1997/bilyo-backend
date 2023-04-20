import { responseGenerator } from 'src/shared/utils/responseGenerator';
import { User } from './../../../schema/user.schema';
import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Get,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './users.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { AuthGuard } from 'src/resources/auth/auth.guard';

@Controller('dashboard/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('avatar')
  @UseInterceptors(FilesInterceptor('avatar'))
  @UseInterceptors()
  async setAvatar(
    @Req() req,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    avatar: Express.Multer.File,
  ) {

    const currentUser = await this.currentUser(req)

    if (!fs.existsSync('public/uploads')) {
      fs.mkdirSync('public/uploads', { recursive: true });
    }
    if (currentUser['avatar']) {
      const currentImage = currentUser['avatar'].split('/');
      fs.unlinkSync(
        `public/uploads/${
          currentImage[currentImage.length - 1]
        }`,
      );
      await this.usersService.removeAvatar(currentUser);
    }

    const originName = avatar[0].originalname.split(' ').join('-');
    const timeStamp = new Date().getTime();
    const fileName = `${timeStamp}-${originName}`;
    fs.writeFileSync(
      `public/uploads/${fileName}`,
      avatar[0].buffer,
    );

    if (!currentUser)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const currentHostPath = `${req.protocol}://${req.get(
      'Host',
    )}/uploads/${fileName}`;
    await this.usersService.setAvatar(currentUser, currentHostPath);
    return responseGenerator(currentUser['id'], 'user avatar created');
  }

  @Get()
  async currentUser(@Req() req) {
    const currentUser = await this.usersService.currentUser(req.user)
    return currentUser;
  }
}
