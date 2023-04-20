import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomNumberGenerator } from '../../shared/utils/randomNumGen';
import { IMobile, IMobileOtp } from './auth.dto';
import { User } from '../../schema/user.schema';
import { constantData } from '../../shared/utils/constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getotp(loginWithMobileDto: IMobile) {
    const { mobile: phone } = loginWithMobileDto;
    const userExist = await this.userModel.findOne({ mobile: phone });
    if (!userExist) return this.createNewUser(phone);
    const updatedUser = await this.updateUser(phone);
    const { mobile, otp } = updatedUser;
    return {
      mobile,
      otp: `${otp}`,
    };
  }

  async checkotp(verifyOtpDto: IMobileOtp) {
    const { mobile: mobileNumber, otp: verfiyCode } = verifyOtpDto;
    const userExist = await this.userModel.findOne({ mobile: mobileNumber });
    const { expiresIn, otp, mobile } = userExist;
    const nowData = new Date().getTime();
    if (+verfiyCode !== +otp)
      throw new UnauthorizedException('کد ارسال شده اشتباه است');

    if (expiresIn < nowData)
      throw new UnauthorizedException('کد شما منقضی شده است');

    const userExpireOtp = await this.updateUserOtpExipre(mobileNumber);

    if (!userExpireOtp)
      throw new UnauthorizedException('کد ارسال شده اشتباه است');

    const payload = { id: mobile };

    // Generate an access token with a short expiration time
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: constantData.expireDateJWT,
    });

    // Generate a refresh token with a long expiration time
    // const refreshToken = this.jwtService.sign(payload, {
    //   expiresIn: constantData.expireDateJWTRefresh,
    // });

    return {
      token: accessToken,
      message: 'login success',
    };
  }

  async createNewUser(mobile: string) {
    const otp = RandomNumberGenerator();
    const expiresIn = new Date().getTime() + 120000;
    const newUser = await this.userModel.create({
      mobile,
      otp,
      expiresIn,
    });
    if (!newUser) throw new BadRequestException('error on created user');
    return {
      mobile,
      otp: `${otp}`,
    };
  }

  async updateUser(mobile: string) {
    const otp = RandomNumberGenerator();
    const expiresIn = new Date().getTime() + 120000;
    const updateUser = await this.userModel.updateOne(
      { mobile },
      { otp, expiresIn },
    );
    if (!updateUser) throw new BadRequestException('Error in update user');
    // return 'new code sent';
    return { mobile, expiresIn, otp };
  }
  async updateUserOtpExipre(mobile: string) {
    const otp = null;
    const expiresIn = null;
    const updateUser = await this.userModel.updateOne(
      { mobile },
      { otp, expiresIn },
    );
    if (!updateUser) return false;

    return true;
  }
}
