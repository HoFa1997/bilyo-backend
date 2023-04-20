import {
  Body,
  Controller,
  Get,
  Post,
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

  @Get("invalid")
  async invalid(@Body() verifyOtpDto: IMobileOtp) {
    return {
      message: "khodas"
    }
  }
}
