import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthModule } from './health/health.module';
import { HealthService } from './health/health.service';
import { TerminusService } from './health/terminus.service';

@Module({
  imports: [
    ConsulModule.register({ dependencies: [NEST_BOOT] }),

    ServiceModule.register({
      dependencies: [NEST_CONSUL],
      service: {
        id: 'comments-ms',
        name: 'comments-ms',
        port: +process.env.PORT,
      },
      healthCheck: {
        timeout: '1s',
        interval: '10s',
        deregistercriticalserviceafter: '30s',
        route: '/health/ready',
      } as any,
      maxRetry: 5,
      retryInterval: 5000,
    }),

    TerminusModule.forRootAsync({
      imports: [HealthModule],
      useClass: TerminusService,
    }),
  ],
  providers: [TerminusService, HealthService],
})
export class AppModule { }
