import { Injectable } from '@nestjs/common';
import { version } from './shared/utils/constant';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello From Bilyo Api! ${version}`;
  }
}
