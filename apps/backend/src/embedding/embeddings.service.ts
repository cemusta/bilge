import { Injectable, Logger } from '@nestjs/common';
import { AzureOpenAIEmbeddings } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmbeddingService {
  private readonly logger: Logger = new Logger(EmbeddingService.name);
  private model: AzureOpenAIEmbeddings;

  constructor(private configService: ConfigService) {
    this.model = new AzureOpenAIEmbeddings({
      // azureOpenAIApiKey: "<your_key>", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
      // azureOpenAIApiInstanceName: "<your_instance_name>", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
      // azureOpenAIApiEmbeddingsDeploymentName: "<your_embeddings_deployment_name>", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
      // azureOpenAIApiVersion: "<api_version>", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
      maxRetries: 1,
    });
    this.logger.log('Embedding service initialized');
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.model.embedDocuments(texts);
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.model.embedQuery(text);
  }
}
