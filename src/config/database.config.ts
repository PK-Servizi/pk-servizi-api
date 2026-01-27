import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: String(configService.get('DB_PASSWORD') || 'postgres'),
    database: configService.get<string>('DB_NAME', 'postgres'),

    // Performance optimizations
    extra: {
      max: configService.get<number>('DB_POOL_SIZE', 30), // Increased connection pool
      min: 10, // Increased minimum pool size
      connectionTimeoutMillis: configService.get<number>(
        'DB_CONNECTION_TIMEOUT',
        3000, // Reduced timeout
      ),
      idleTimeoutMillis: configService.get<number>('DB_IDLE_TIMEOUT', 30000),
      query_timeout: configService.get<number>('DB_QUERY_TIMEOUT', 20000), // Reduced query timeout
      statement_timeout: 20000, // 20 second max statement time
      // PostgreSQL specific optimizations
      application_name: 'pk-servizi-api',
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    },

    entities: [__dirname + '/../modules/*/entities/*.entity.{ts,js}'],
    migrations: [__dirname + '/../../migrations/*.{ts,js}'],

    synchronize: false,
    migrationsRun: false,
    logging:
      !isProduction && configService.get<boolean>('TYPEORM_LOGGING', false),
    namingStrategy: new SnakeNamingStrategy(),

    maxQueryExecutionTime: configService.get<number>('DB_SLOW_QUERY_LOG', 1000),

    // SSL for production
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
};

export default databaseConfig;
