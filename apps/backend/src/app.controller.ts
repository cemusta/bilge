import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  hello() {
    return 'hello';
  }

  @Post('index-wiki')
  async indexWiki(@Body() body: { wikiName: string }) {
    this.logger.log('Indexing single page tex');
    return await this.appService.indexWiki(body.wikiName);
  }

  @Post('index-page')
  async indexPage(@Body() body: { wikiName: string; pageId: string }) {
    this.logger.log('Indexing single page tex');
    return await this.appService.indexPage(body.wikiName, body.pageId);
  }

  @Post('query')
  async getTexts(@Body() body: { query: string }) {
    this.logger.log('Querying text');
    return await this.appService.getText(body.query);
  }
}
