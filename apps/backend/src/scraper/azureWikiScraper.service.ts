import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';
import type { HttpError } from '../types/error.types';

type WikiV2 = {
  id: string; // UUID
  isDisabled: boolean;
  mappedPath?: string; // Optional for ProjectWiki
  name: string;
  projectId: string; // UUID
  properties: Record<string, unknown>; // Assuming properties is a key-value object
  remoteUrl: string;
  repositoryId?: string; // UUID, optional for ProjectWiki
  type: string;
  url: string;
  // versions: GitVersionDescriptor[];
};

type PageDetails = {
  id: string;
  path: string;
};

type WikiResponse<T> = {
  count: number;
  value: T[];
};

@Injectable()
export class AzureWikiScraperService {
  private readonly logger: Logger = new Logger(AzureWikiScraperService.name);
  private readonly project: string;
  private readonly organization: string;
  private readonly pat: string;
  private readonly apiVersion = '7.1';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.project = this.configService.getOrThrow<string>('AZURE_PROJECT');
    this.organization = this.configService.getOrThrow<string>('AZURE_ORG');
    this.pat = this.configService.getOrThrow<string>('AZURE_DEVOPS_PAT');
  }

  public async getAllWikis(): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WikiResponse<WikiV2>>(
          `https://dev.azure.com/${this.organization}/_apis/wiki/wikis`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`:${this.pat}`).toString('base64')}`,
            },
            params: {
              'api-version': this.apiVersion,
            },
          },
        )
        .pipe(
          catchError((error: HttpError) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
    );

    return data.value.map((wiki) => wiki.name);
  }

  public async getProjectWikis(project: string): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WikiResponse<WikiV2>>(
          `https://dev.azure.com/${this.organization}/${project}/_apis/wiki/wikis`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`:${this.pat}`).toString('base64')}`,
            },
            params: {
              'api-version': this.apiVersion,
            },
          },
        )
        .pipe(
          catchError((error: HttpError) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
    );

    return data.value.map((wiki) => wiki.name);
  }

  public async getAllPages(wikiName: string) {
    const pages: PageDetails[] = [];
    let continuationToken = '';

    // Get the first batch of pages
    const resp = await this.getPagesBatch(wikiName);
    pages.push(...resp.data.value);
    continuationToken = resp.continuationToken;

    console.log('continuationToken', continuationToken);

    // Get the rest of the pages
    while (continuationToken) {
      const nextBatch = await this.getPagesBatch(wikiName, continuationToken);
      pages.push(...nextBatch.data.value);
      continuationToken = nextBatch.continuationToken;
    }

    this.logger.log(`Found ${pages.length} pages in ${wikiName}`);

    return pages;
    // .map((page) => page.path)
    // .filter((path) => !path.startsWith('_'));
  }

  private async getPagesBatch(wikiName: string, continuationToken?: string) {
    const response = await firstValueFrom(
      this.httpService
        .post<WikiResponse<PageDetails>>(
          `https://dev.azure.com/${this.organization}/${this.project}/_apis/wiki/wikis/${wikiName}/pagesbatch`,
          {
            continuationToken: continuationToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`:${this.pat}`).toString('base64')}`,
            },
            params: {
              'api-version': this.apiVersion,
            },
          },
        )
        .pipe(
          catchError((error: HttpError) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
    );

    return {
      data: response.data,
      continuationToken: response.headers['x-ms-continuationtoken'] as string,
    };
  }

  public async getPageContent(wikiName: string, path: string) {
    const response = await firstValueFrom(
      this.httpService
        .get<string>(
          `https://dev.azure.com/${this.organization}/${this.project}/_apis/wiki/wikis/${wikiName}/pages?path=${path}`,
          {
            headers: {
              'Content-Type': 'text/plain',
              Authorization: `Basic ${Buffer.from(`:${this.pat}`).toString('base64')}`,
            },
            params: {
              'api-version': this.apiVersion,
            },
          },
        )
        .pipe(
          catchError((error: HttpError) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
    );

    return response.data;
  }

  public async getPageContentById(wikiName: string, id: string) {
    const response = await firstValueFrom(
      this.httpService
        .get<string>(
          `https://dev.azure.com/${this.organization}/${this.project}/_apis/wiki/wikis/${wikiName}/pages/${id}`,
          {
            headers: {
              'Content-Type': 'text/plain',
              accept: 'text/plain',
              Authorization: `Basic ${Buffer.from(`:${this.pat}`).toString('base64')}`,
            },
            params: {
              'api-version': this.apiVersion,
            },
          },
        )
        .pipe(
          catchError((error: HttpError) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
    );

    return {
      link: `https://dev.azure.com/${this.organization}/${this.project}/_wiki/wikis/${wikiName}/${id}`,
      content: response.data,
    };
  }
}
