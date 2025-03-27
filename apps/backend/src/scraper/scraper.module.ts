import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { AzureWikiScraperService } from './azureWikiScraper.service';
import { ScraperController } from './scraper.controller';

@Module({
  imports: [HttpModule],
  controllers: [ScraperController],
  providers: [AzureWikiScraperService],
  exports: [AzureWikiScraperService],
})
export class ScraperModule {}
