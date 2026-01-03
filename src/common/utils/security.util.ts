import { BadRequestException } from '@nestjs/common';

export class SecurityUtil {
  static sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['\"]/g, '') // Remove quotes
      .replace(/[{}]/g, '') // Remove braces
      .replace(/[\\[\\]]/g, '') // Remove brackets
      .replace(/\\$/g, '') // Remove dollar signs (MongoDB operators)
      .trim();
  }

  static validateId(id: any): string {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    if (typeof id !== 'string') {
      throw new BadRequestException('ID must be a string');
    }
    const sanitized = id.replace(/[^a-zA-Z0-9-]/g, '');

    if (sanitized !== id) {
      throw new BadRequestException(
        'Invalid ID format - contains illegal characters',
      );
    }

    this.validateUUID(sanitized);
    return sanitized;
  }

  static validateObject(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    const dangerousKeys = [
      '$where',
      '$regex',
      '$ne',
      '$gt',
      '$gte',
      '$lt',
      '$lte',
      '$in',
      '$nin',
      '$exists',
      '$type',
      '$or',
      '$and',
      '$not',
      '$nor',
      '$expr',
      '$jsonSchema',
      '$mod',
      '$all',
      '$elemMatch',
      '$size',
    ];

    for (const key of Object.keys(obj)) {
      if (dangerousKeys.includes(key)) {
        throw new BadRequestException(
          `Potentially dangerous query operator detected: ${key}`,
        );
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.validateObject(obj[key]);
      }
    }
  }

  static validateUUID(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  static sanitizeLogMessage(message: string): string {
    if (!message) return message;

    return message
      .replace(/[\r\n]/g, '_') // Replace newlines
      .replace(/[\t]/g, ' ') // Replace tabs
      .replace(/[^\x20-\x7E]/g, ''); // Remove non-printable chars
  }

  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Invalid email format');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new BadRequestException('Invalid email format');
    }

    return true;
  }

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>\"'%;()&+]/g, '') // Remove potentially dangerous characters
      .substring(0, 1000); // Limit length
  }

  static sanitizeQueryParams(params: any): any {
    if (!params || typeof params !== 'object') return params;

    const sanitized = { ...params };
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = this.sanitizeString(sanitized[key]);
      } else if (
        typeof sanitized[key] === 'object' &&
        sanitized[key] !== null
      ) {
        this.validateObject(sanitized[key]);
      }
    }
    return sanitized;
  }

  static validateIdArray(ids: string[]): string[] {
    if (!Array.isArray(ids)) {
      throw new BadRequestException('Expected array of IDs');
    }
    return ids.map((id) => this.validateId(id));
  }

  static validatePassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password is required');
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    return true;
  }
}
