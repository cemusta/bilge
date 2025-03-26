import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

import { AzureWikiScraperService } from './scraper/azureWikiScraper.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scraperService: AzureWikiScraperService,
  ) {}

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
  async getPage(
    @Param('wiki') wiki: string,
    @Param('pageId') pageId: string,
  ): Promise<string> {
    const content = await this.scraperService.getPageContentById(wiki, pageId);
    return content;
  }
}
