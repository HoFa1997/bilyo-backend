import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { AuthGuard } from 'src/resources/auth/auth.guard';
import { IUser } from 'src/shared/interface/user';

@Controller('dashboard/customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
    const user = req.user as unknown as IUser;
    return await this.customersService.create(createCustomerDto, user);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user as unknown as IUser;
    return this.customersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user as unknown as IUser;
    return this.customersService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() req,
  ) {
    const user = req.user as unknown as IUser;
    return await this.customersService.update(id, updateCustomerDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const user = req.user as unknown as IUser;
    return await this.customersService.remove(id, user);
  }
}
