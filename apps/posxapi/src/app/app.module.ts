import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrintersModule } from './printers/printers.module';
import { ProductsModule } from './products/products.module';
import { SettingsModule } from './settings/settings.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

const MONGO_HOST = process.env['MONGO_HOST'] || 'localhost';
const MONGO_DB = process.env['MONGO_DB'] || 'posxpress';
const MONGO_PORT = process.env['MONGO_PORT'] || 27017;
const MONGO_ADMIN_USER = process.env['MONGO_ADMIN_USER'] || 'root';
const MONGO_ADMIN_PASSWORD = process.env['MONGO_ADMIN_PASSWORD'] || 'posxpress';

@Module({
  imports: [
    UsersModule,
    PrintersModule,
    ProductsModule,
    SettingsModule,
    OrdersModule,
    AuthModule,
    MongooseModule.forRoot(
      `mongodb://${MONGO_ADMIN_USER}:${MONGO_ADMIN_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
      { authSource: 'admin' }
    ),
  ],
  controllers: [AppController],
})
export class AppModule {}
