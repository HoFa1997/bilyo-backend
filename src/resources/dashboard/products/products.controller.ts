import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductValidator,
} from './products.dto';
import { JoiValidationPipe } from 'src/resources/auth/validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schema/user.schema';
import { responseGenerator } from 'src/shared/utils/responseGenerator';

@Controller('dashboard/products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(ProductValidator))
  async create(@Body() createProductDto: CreateProductDto, @Req() req) {
    const currentUser = req.user as unknown as User;
    const createUser = await this.productsService.create(
      createProductDto,
      currentUser,
    );

    return responseGenerator(createUser.id, 'product created');
  }

  @Get()
  async findAll(@Req() req) {
    const currentUser = req.user as unknown as User;
    const getProducts = await this.productsService.findAll(currentUser);
    return getProducts;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as unknown as User;
    const getProduct = await this.productsService.findOne(id, currentUser);
    return getProduct;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const currentUser = req.user as unknown as User;
    const updateProduct = await this.productsService.update(
      id,
      updateProductDto,
      currentUser,
    );

    return responseGenerator(updateProduct['id'], 'product updated');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as unknown as User;
    const deleteProduct = await this.productsService.remove(id, currentUser);
    return responseGenerator(deleteProduct['id'], 'product deleted');
  }
}
