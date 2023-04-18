import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
import { AuthGuard } from './auth.guard';
import { IUser } from 'src/shared/interface/user';

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
  async checkOtp(@Body() verifyOtpDto: IMobileOtp) {
    return await this.authService.checkotp(verifyOtpDto);
  }

  @Post('register')
  @UsePipes(new JoiValidationPipe(EmailSinUpValidator))
  async sinupEmail(@Body() emailDto: IEmailSinup) {
    return await this.authService.sinupUser(emailDto);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(EmailLoginValidator))
  async singIn(@Body() emailDto: IEmailLogin) {
    return await this.authService.singInUser(emailDto);
  }

  @Get('isvalid')
  @UseGuards(AuthGuard)
  checkUserToken(@Req() req) {
    const user = req.user as unknown as IUser;
    return this.authService.checkUserToken(user);
  }

  @Get('checkRule')
  @UseGuards(AuthGuard)
  checkRole(@Req() req) {
    const user = req.user as unknown as IUser;
    return this.authService.checkRule(user);
  }
}
