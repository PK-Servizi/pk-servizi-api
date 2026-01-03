import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = this.formatErrors(errors);
        return new BadRequestException(messages);
      },
    });
  }
  private formatErrors(errors: ValidationError[]): string[] {
    const errorMessages: string[] = [];

    const extractErrors = (
      validationErrors: ValidationError[],
      parentPath = '',
    ) => {
      validationErrors.forEach((error) => {
        const propertyPath = parentPath
          ? `${parentPath}.${error.property}`
          : error.property;

        if (error.constraints) {
          Object.values(error.constraints).forEach((message) => {
            errorMessages.push(`${propertyPath}: ${message}`);
          });
        }

        if (error.children && error.children.length > 0) {
          extractErrors(error.children, propertyPath);
        }
      });
    };

    extractErrors(errors);
    return errorMessages;
  }
}
