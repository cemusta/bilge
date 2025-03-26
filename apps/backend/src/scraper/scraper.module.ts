import { Module } from '@nestjs/common';
// import { ScraperService } from './scraper.service';
import { HttpModule } from '@nestjs/axios';
import { AzureWikiScraperService } from './azureWikiScraper.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AzureWikiScraperService],
  exports: [AzureWikiScraperService],
})
export class ScraperModule {}
