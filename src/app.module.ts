import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { UnittypesModule } from './modules/unittypes/unittypes.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { PurchaseModule } from './modules/purchase/purchase.module.js';
import { SuppliersModule } from './modules/suppliers/suppliers.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { WarehousesModule } from './modules/warehouses/warehouses.module.js';
import { ExpensesModule } from './modules/expenses/expenses.module.js';
import { ReportsModule } from './modules/reports/reports.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { DatabaseModule } from './database/database.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'sass-based-inventory-management-system',
    }),
    CategoriesModule,
    UnittypesModule,
    ProductsModule,
    PurchaseModule,
    SuppliersModule,
    CustomersModule,
    WarehousesModule,
    ExpensesModule,
    ReportsModule,
    UsersModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
