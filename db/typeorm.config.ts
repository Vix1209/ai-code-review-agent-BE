import { DataSource } from 'typeorm';
import { createTypeOrmConfig } from 'src/database/database.module';

export default new DataSource({
  ...createTypeOrmConfig(),
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
