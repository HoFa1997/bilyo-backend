import { AuthModule } from './resources/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './resources/dashboard/products/products.module';
import { CustomersModule } from './resources/dashboard/customers/customers.module';
import { InvoicesModule } from './resources/dashboard/invoices/invoices.module';
import { PlansModule } from './resources/plans/plans.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './resources/dashboard/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Fatemi1375:Fatemi1375@bilyodb.ebjk2ff.mongodb.net/?retryWrites=true&w=majority'
    ),
    AuthModule,
    ProductsModule,
    CustomersModule,
    InvoicesModule,
    PlansModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
