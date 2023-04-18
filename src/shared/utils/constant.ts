import { CookieOptions } from 'express';
export const ROLES = {
  MEMBER: 'member',
  ADMIN: 'admin',
};
export const ACCESS_TOKEN_SECRET_KEY =
  'CCEBD888251E547C877C43A324B5DE12468F431EA0D19A259751E2C80EE35876';
export const REFRESH_TOKEN_SECRET_KEY =
  '782285F688AC9B7CFF599230A39C49558A9D4B615B85AF706A80FAF52C897FB5';

export enum constantData {
  expireDateJWT = 31536000000,
  expireDateJWTRefresh = 31536000000, //1y
}

export const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: constantData.expireDateJWT,
  path: '/',
  sameSite: 'none',
  domain: 'bilyo.ir',
};

export const cookieTokenKey = 'token';

export const mongooseConfig = {
  versionKey: false,
  id: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};

export const version = '1.0.2';
