import { Module } from '@nestjs/common';

import { configModule, mongooseModule } from './main.config';

import { ScraperModule } from './scraper/scraper.module';
import { EmbeddingModule } from './embedding/embeddings.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { VectorModule } from './vector/vector.module';

@Module({
  imports: [
    configModule,
    mongooseModule,
    ScraperModule,
    EmbeddingModule,
    VectorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
