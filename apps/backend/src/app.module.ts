import { Module } from '@nestjs/common';

import { configModule } from './main.config';

import { ScraperModule } from './scraper/scraper.module';
import { EmbeddingModule } from './embedding/embeddings.module';

@Module({
  imports: [configModule, ScraperModule, EmbeddingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
