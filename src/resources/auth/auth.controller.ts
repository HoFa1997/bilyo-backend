import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response, Express } from 'express';
// dont remove it
// eslint-disable-next-line
import { Multer } from 'multer';
import {
  EmailLoginValidator,
  EmailSinUpValidator,
  IEmailLogin,
  IEmailSinup,
  IMobile,
  IMobileOtp,
  MobileOtpValidator,
  MobileValidator,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from './validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schema/user.schema';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('getOtp')
  @UsePipes(new JoiValidationPipe(MobileValidator))
  async getOtp(@Body() loginWithMobileDto: IMobile) {
    return await this.authService.getotp(loginWithMobileDto);
  }

  @Post('checkOtp')
  @UsePipes(new JoiValidationPipe(MobileOtpValidator))
  async checkOtp(
    @Body() verifyOtpDto: IMobileOtp,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.checkotp(verifyOtpDto, res);
  }

  @Post('register')
  @UsePipes(new JoiValidationPipe(EmailSinUpValidator))
  async sinupEmail(@Body() emailDto: IEmailSinup, @Res() res: Response) {
    return await this.authService.sinupUser(emailDto, res);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(EmailLoginValidator))
  async singIn(@Body() emailDto: IEmailLogin, @Res() res: Response) {
    return await this.authService.singInUser(emailDto, res);
  }

  @Get('checkRule')
  @UseGuards(JwtAuthGuard)
  async checkRule(@Req() req: Request) {
    const user = req.user as unknown as User;
    return await this.authService.checkRule(user);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }

  @Get('isvalid')
  @UseGuards(AuthGuard('jwt'))
  checkUserToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkUserToken(req, res);
  }
}
