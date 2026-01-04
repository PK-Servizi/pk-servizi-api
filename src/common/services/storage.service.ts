import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!region || !accessKeyId || !secretAccessKey || !this.bucket) {
      this.logger.error('AWS S3 configuration is missing');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
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

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      return {
        path: filePath,
        publicUrl: `https://${this.bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${filePath}`,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });

      return getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      throw new BadRequestException('Failed to generate secure link');
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }
}
