import { ApiModule } from '@app/api/api.module';
import { CoreModule } from '@app/core/core.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule, ApiModule],
})
export class AppModule {}
