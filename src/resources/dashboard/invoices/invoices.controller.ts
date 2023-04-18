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
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard/invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req) {
    const currentUser = req.user as unknown as User;
    const createdInvoice = await this.invoicesService.create(
      createInvoiceDto,
      currentUser,
    );
    return responseGenerator(createdInvoice['id'], 'created invoice');
  }

  @Get()
  async findAll(@Req() req) {
    const currentUser = req.user as unknown as User;
    return await this.invoicesService.findAll(currentUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as unknown as User;
    return await this.invoicesService.findOne(id, currentUser);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Req() req,
  ) {
    const currentUser = req.user as unknown as User;
    const updatedInvoice = await this.invoicesService.update(
      id,
      updateInvoiceDto,
      currentUser,
    );
    return responseGenerator(updatedInvoice['id'], 'updated invoice');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as unknown as User;
    const deletedInvoice = await this.invoicesService.remove(id, currentUser);
    return responseGenerator(deletedInvoice['id'], 'deleted invoice');
  }

  // @Put('line-item/remove')
  // removeInvoiceItem(@Body() createInvoiceLineItem: any, @Req() req) {
  //   const currentUser = req.user as unknown as User;
  //   const removedInvoiceItem = this.invoicesService.removeInvoiceItem(createInvoiceLineItem, currentUser);
  //   return responseGenerator(removedInvoiceItem['id'], 'deleted invoice Item');
  // }
}
