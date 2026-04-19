import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntegradorDmsNbsService } from './integrador-dms-nbs.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'nbs-dms',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'oracle',
        host: config.get<string>('NBS_DATABASE_HOST'),
        port: config.get<number>('NBS_DATABASE_PORT'),
        username: config.get<string>('NBS_DATABASE_USER'),
        password: config.get<string>('NBS_DATABASE_PASS'),
        sid: config.get<string>('NBS_DATABASE_SID'),
        synchronize: false,
        entities: [],
        extra: {
          queueTimeout: 120000,
          poolMin: 2,
          poolMax: 10,
          poolPingInterval: 60000,
          poolTimeout: 300000,
        },
      }),
    }),
  ],
  providers: [IntegradorDmsNbsService],
  exports: [IntegradorDmsNbsService],
})
export class IntegradorDmsNbsModule {}