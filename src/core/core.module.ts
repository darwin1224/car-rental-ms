import { CacheModule } from '@app/core/cache/cache.module';
import { DatabaseModule } from '@app/core/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule,
    DatabaseModule,
  ],
})
export class CoreModule {}
