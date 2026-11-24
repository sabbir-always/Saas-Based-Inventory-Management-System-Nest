import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { UnittypesModule } from './modules/unittypes/unittypes.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { PurchaseModule } from './modules/purchase/purchase.module.js';
import { SuppliersModule } from './modules/suppliers/suppliers.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { ExpensesModule } from './modules/expenses/expenses.module.js';
import { ReportsModule } from './modules/reports/reports.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { InstallmentModule } from './modules/installment/installment.module.js';
import { CustomersPaymentModule } from './modules/customers-payment/customers-payment.module.js';
import { SuppliersPaymentModule } from './modules/suppliers-payment/suppliers-payment.module.js';
import { SalesModule } from './modules/sales/sales.module.js';
import { StockAdjustmentModule } from './modules/stock-adjustment/stock-adjustment.module.js';
import { SalesReturnModule } from './modules/sales-return/sales-return.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useFactory: () => ({ uri: process.env.MONGODB_URI as string }) }),
    CategoriesModule, UnittypesModule, ProductsModule, PurchaseModule, SuppliersModule, CustomersModule, ExpensesModule, ReportsModule, UsersModule, InstallmentModule, CustomersPaymentModule, SuppliersPaymentModule, SalesModule, StockAdjustmentModule, SalesReturnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
