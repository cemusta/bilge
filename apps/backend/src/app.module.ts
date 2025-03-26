import { Module } from '@nestjs/common';

import { configModule } from './main.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [configModule, ScraperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
