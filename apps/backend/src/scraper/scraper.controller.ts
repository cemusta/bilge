import { Controller, Get, Header, Param } from '@nestjs/common';

import { AzureWikiScraperService } from './azureWikiScraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: AzureWikiScraperService) {}

  @Get('/wikis')
  async getAll() {
    return this.scraperService.getAllWikis();
  }

  @Get('/wikis/:project')
  async wiki(@Param('project') project: string) {
    return this.scraperService.getProjectWikis(project);
  }

  @Get('/wikis/:wiki/pages')
  async pages(@Param('wiki') wiki: string) {
    return this.scraperService.getAllPages(wiki);
  }

  @Get('/wikis/:wiki/pages/:pageId')
  @Header('content-type', 'text/plain; charset=utf-8; api-version=7.1')
  async getPage(@Param('wiki') wiki: string, @Param('pageId') pageId: string) {
    return this.scraperService.getPageContentById(wiki, pageId);
  }
}
