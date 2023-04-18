import * as Joi from 'joi';

export const MobileValidator = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .required(),
});

export const MobileOtpValidator = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error('شماره موبایل وارد شده صحیح نمیباشد')),
  otp: Joi.string().length(6).error(new Error('کد ارسال شده صحیح نمیباشد')),
});

export const EmailSinUpValidator = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
  password_confirm: Joi.ref('password'),
});

export const EmailLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
});

export interface IEmailSinup {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}
export interface IEmailLogin {
  email: string;
  password: string;
}

export interface IMobile {
  mobile: string;
}
export interface IMobileOtp {
  mobile: string;
  otp: string;
}
