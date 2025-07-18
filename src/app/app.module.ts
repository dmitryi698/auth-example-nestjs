import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { AuthModule } from '../auth';
import { UserModule } from '@modules/user';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KyselyModule.forRoot({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl:
            process.env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
        }),
      }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
