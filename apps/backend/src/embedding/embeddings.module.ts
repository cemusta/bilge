import { Module } from '@nestjs/common';
import { EmbeddingService } from './embeddings.service';
import { ChunkingService } from './chunking.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ChunkingService, EmbeddingService],
  exports: [ChunkingService, EmbeddingService],
})
export class EmbeddingModule {}
