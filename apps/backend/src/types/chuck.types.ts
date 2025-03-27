export interface InsertChunkData {
  vector: number[];
  pageContent: string;
  file: string;
}

export type ExtractChunkData = {
  _id: string;
  score: number;
  pageContent: string;
  file: string;
};
