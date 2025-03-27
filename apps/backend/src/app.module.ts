import { Module } from '@nestjs/common';

import { configModule, mongooseModule } from './main.config';

import { ScraperModule } from './scraper/scraper.module';
import { EmbeddingModule } from './embedding/embeddings.module';

@Module({
  imports: [configModule, mongooseModule, ScraperModule, EmbeddingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
