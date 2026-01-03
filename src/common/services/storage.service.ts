import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    const projectId = this.configService.get<string>('GOOGLE_CLOUD_PROJECT_ID');
    const keyFilename = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );
    this.bucket = this.configService.get<string>('GOOGLE_CLOUD_STORAGE_BUCKET');

    if (!projectId || !keyFilename || !this.bucket) {
      this.logger.error('Google Cloud Storage configuration is missing');
      // Warning only to allow app to start even if GCS is somehow misconfigured initially,
      // but methods will fail. Ideally should be strict, but user faced crash loop.
      // throw new InternalServerErrorException('Storage configuration missing');
    }

    this.storage = new Storage({
      projectId,
      keyFilename,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    pathPrefix: string,
  ): Promise<{ path: string; publicUrl: string }> {
    try {
      const fileExt = extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `${pathPrefix}/${fileName}`;

      const bucket = this.storage.bucket(this.bucket);
      const blob = bucket.file(filePath);

      await blob.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
      });

      // Usually GCS buckets are private. publicUrl is only valid if object is public.
      // For private objects, we usually don't return a permanent publicUrl but depend on signed URLs.
      // However, to keep interface compatible, we can return the GS URI or a placeholder.
      // Or if the bucket is public: `https://storage.googleapis.com/${this.bucket}/${filePath}`

      return {
        path: filePath,
        publicUrl: `https://storage.googleapis.com/${this.bucket}/${filePath}`,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    try {
      const options = {
        version: 'v4' as const,
        action: 'read' as const,
        expires: Date.now() + expiresIn * 1000,
      };

      const [url] = await this.storage
        .bucket(this.bucket)
        .file(path)
        .getSignedUrl(options);
      return url;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      throw new BadRequestException('Failed to generate secure link');
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await this.storage.bucket(this.bucket).file(path).delete();
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }
}
