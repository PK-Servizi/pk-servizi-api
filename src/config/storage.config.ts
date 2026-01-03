import { ConfigService } from '@nestjs/config';

export const storageConfig = (config: ConfigService) => ({
  projectId: config.get<string>('GOOGLE_CLOUD_PROJECT_ID'),
  keyFilePath: config.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
  bucket: config.get<string>('GOOGLE_CLOUD_STORAGE_BUCKET'),
});
