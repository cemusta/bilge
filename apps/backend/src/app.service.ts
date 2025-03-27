import { Injectable, Logger } from '@nestjs/common';

import { ChunkingService } from './embedding/chunking.service';
import { EmbeddingService } from './embedding/embeddings.service';
import { VectorRepository } from './vector/vector.repository';
import { InsertChunkData } from './types/chuck.types';
import { AzureWikiScraperService } from './scraper/azureWikiScraper.service';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);
  constructor(
    private readonly scraper: AzureWikiScraperService,
    private readonly chunker: ChunkingService,
    private readonly embedder: EmbeddingService,
    private readonly vectorRepo: VectorRepository,
  ) {}

  async indexWiki(wikiName: string) {
    const pages = await this.scraper.getAllPages(wikiName);

    this.logger.log(`Total pages to import: ${pages.length}`);
    for (const [index, page] of pages.entries()) {
      this.logger.log(
        `Importing page ${index + 1}/${pages.length}: ${page.id}`,
      );
      await this.indexPage(wikiName, page.id);
    }
  }

  async indexPage(wikiName: string, pageId: string) {
    try {
      const wikiContent = await this.scraper.getPageContentById(
        wikiName,
        pageId,
      );

      const chunks = await this.chunker.rawTextLoader(wikiContent.content);

      const vectors = await this.embedder.embedDocuments(chunks);

      const toStoreChunks = chunks.map((chunk, index) => {
        return <InsertChunkData>{
          file: wikiContent.link,
          pageContent: chunk,
          vector: vectors[index],
        };
      });

      await this.vectorRepo.insertChunks(toStoreChunks);

      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getText(query: string) {
    const vector = await this.embedder.embedQuery(query);

    return this.vectorRepo.similaritySearch(vector);
  }
}
