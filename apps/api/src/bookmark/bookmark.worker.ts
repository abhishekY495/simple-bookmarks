import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { BookmarkParsingStatus } from '@repo/schemas';
import { Job } from 'bullmq';
import {
  BOOKMARK_PARSE_JOB_TYPE,
  BOOKMARK_PARSING_QUEUE_NAME,
} from 'src/utils/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { getMetadata } from 'src/bookmark/utils/get-metadata';
import { getMetadataFromCloudflareBrowserRendering } from './utils/get-metadata-from-cloudflare-browser-rendering';

@Processor(BOOKMARK_PARSING_QUEUE_NAME, {
  concurrency: 50,
})
export class BookmarkWorker extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<BOOKMARK_PARSE_JOB_TYPE>) {
    const { url } = job.data;
    let metadata = await getMetadata(url);

    if (!metadata.title || !metadata.ogImage) {
      console.log('No metadata found, using CFBR');
      const metadataFromCfbr =
        await getMetadataFromCloudflareBrowserRendering(url);
      metadata = {
        title: metadataFromCfbr.title,
        ogImage: metadataFromCfbr.ogImage,
      };
    }

    await this.prisma.bookmark.update({
      where: { id: job.data.bookmarkId },
      data: {
        parsingStatus: BookmarkParsingStatus.success,
        title: metadata.title,
        cover: metadata.ogImage,
      },
    });
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<BOOKMARK_PARSE_JOB_TYPE>) {
    console.log('Completed', job.id);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<BOOKMARK_PARSE_JOB_TYPE>) {
    console.log('Failed', job.id);
    await this.prisma.bookmark.update({
      where: { id: job.data.bookmarkId },
      data: { parsingStatus: BookmarkParsingStatus.failed },
    });
  }
}
