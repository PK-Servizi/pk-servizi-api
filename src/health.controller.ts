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

  @Get('/')
  root() {
    return {
      name: 'PK SERVIZI API',
      version: '1.0.0',
      status: 'running',
      documentation: '/api/v1',
      health: '/health',
    };
  }

  @Get('robots.txt')
  robots(@Res() res: Response) {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /api/\nAllow: /health');
  }
}
