import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'PK SERVIZI API',
    };
  }

  @Get('favicon.ico')
  favicon(@Res() res: Response) {
    res.status(204).end();
  }
}
