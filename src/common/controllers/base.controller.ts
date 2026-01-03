import { UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';

@UseFilters(GlobalExceptionFilter)
export abstract class BaseController {}
