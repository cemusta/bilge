import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractChunkData, InsertChunkData } from '../types/chuck.types';
import { Vector } from './vector.schema';

@Injectable()
export class VectorRepository {
  constructor(
    @InjectModel(Vector.name) private readonly vectorModel: Model<Vector>,
  ) {}

  async insertChunks(chunks: InsertChunkData[]): Promise<number> {
    const insertResult = await this.vectorModel.insertMany(
      chunks.map(({ file, pageContent, vector }) => ({
        file,
        vector,
        pageContent,
      })),
    );
    return insertResult.length;
  }

  async insertChunk({ file, pageContent, vector }: InsertChunkData) {
    return await this.vectorModel.create({
      file,
      vector,
      pageContent,
    });
  }

  async similaritySearch(query: number[]): Promise<ExtractChunkData[]> {
    const results = await this.vectorModel.aggregate<ExtractChunkData>([
      {
        $vectorSearch: {
          index: 'vector_index', // indicate the index we goin to use for our search
          path: 'vector', // indicate the field the vectors are stored
          queryVector: query,
          numCandidates: 100, // number of chunks to consider for the comparison
          limit: 5, // the number of returned results on score order from high to low
        },
      },
      {
        $project: {
          // here we define wich fields we want to return, 1 return the field and 0 to hide it
          _id: 1,
          pageContent: 1,
          file: 1,
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
    ]);

    return results;
  }
}
