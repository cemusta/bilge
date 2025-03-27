import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class ChunkingService {
  constructor() {}
  async rawTextLoader(text: string) {
    const chunker = new RecursiveCharacterTextSplitter({
      chunkSize: 1800, // Max characters per chunk
      chunkOverlap: 200, // Overlapping characters between chunks for context
      separators:
        RecursiveCharacterTextSplitter.getSeparatorsForLanguage('markdown'),
    });

    const chunks = await chunker.splitText(text);

    return chunks;
  }
}
