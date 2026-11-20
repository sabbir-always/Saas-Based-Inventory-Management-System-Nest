import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
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
import { DatabaseModule } from './database/database.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriesModule, UnittypesModule, ProductsModule, PurchaseModule, SuppliersModule, CustomersModule, ExpensesModule, ReportsModule, UsersModule, DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
