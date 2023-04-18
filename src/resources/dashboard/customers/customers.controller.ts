import { responseGenerator } from 'src/shared/utils/responseGenerator';
import { User } from 'src/schema/user.schema';
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

@Controller('dashboard/customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
    const currentUser = req.user as unknown as User;
    const createdCustomer = await this.customersService.create(
      createCustomerDto,
      currentUser,
    );

    return responseGenerator(createdCustomer['id'], 'customer created');
  }

  @Get()
  findAll(@Req() req) {
    const currentUser = req.user as unknown as User;
    return this.customersService.findAll(currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as unknown as User;
    return this.customersService.findOne(id, currentUser);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() req,
  ) {
    const currentUser = req.user as unknown as User;
    const updatedCustomer = await this.customersService.update(
      id,
      updateCustomerDto,
      currentUser,
    );
    return responseGenerator(updatedCustomer['id'], 'customer updated');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as unknown as User;
    const deletedCustomer = await this.customersService.remove(id, currentUser);
    return responseGenerator(deletedCustomer['id'], 'customer deleted');
  }
}
