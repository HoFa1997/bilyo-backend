import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RandomNumberGenerator } from '../../shared/utils/randomNumGen';
import { IEmailLogin, IEmailSinup, IMobile, IMobileOtp } from './auth.dto';
import { User } from '../../schema/user.schema';
import { constantData } from '../../shared/utils/constant';
import * as bcrypt from 'bcrypt';
import { responseGenerator } from 'src/shared/utils/responseGenerator';
import { IUser } from 'src/shared/interface/user';

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

  async checkExistUser(email: string) {
    return await this.userModel.findOne({ email });
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

  async checkRule(req: Request) {
    const { user } = req as unknown as IUser;
    const { rules } = await this.userModel.findOne({ email: user.id });
    return responseGenerator(user.id, rules);
  }

  async sinupUser(emailDto: IEmailSinup) {
    const { email, password, name } = emailDto;
    const user = await this.userModel.findOne({ email });
    if (user) throw new ConflictException('This email address is already');
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const newUser = await this.userModel.create({
      name: name,
      email: email,
      password: hash,
    });
    if (!newUser) throw new BadRequestException('Error on user creating');
    const payload = { id: email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: constantData.expireDateJWT,
    });

    return {
      token: accessToken,
      message: 'login success',
    };
  }

  async singInUser(emailDto: IEmailLogin) {
    const { password, email } = emailDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    const payload = { id: email };
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

  async checkUserToken(req: Request) {
    const { user } = req as unknown as IUser;
    return responseGenerator(user.id, 'token valid');
  }
}
