import { Controller, Get } from '@nestjs/common';

import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  getHealth() {
    // TODO: Implement Health check /health/ready /health/live
    return { message: 'OK' };
  }
}
