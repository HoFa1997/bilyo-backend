import { AuthGuard } from './auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  IMobile,
  IMobileOtp,
  MobileOtpValidator,
  MobileValidator,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from './validate.pipe';

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

  @Get("isvalid")
  @UseGuards(AuthGuard)
  async isvalid(@Req() req, @Res() res) {
    return this.authService.checkUserToken(req, res);
  }
}
