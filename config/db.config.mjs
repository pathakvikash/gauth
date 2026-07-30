export const DB_ENVIRONMENTS = {
  dev: {
    provider: 'sqlite',
    schemaPath: 'prisma/schema.prisma',
  },
  prod: {
    provider: 'postgresql',
    schemaPath: 'prisma/schema.production.prisma',
  },
};

export function resolveDbEnv() {
  if (process.env.APP_ENV === 'dev' || process.env.APP_ENV === 'prod') {
    return process.env.APP_ENV;
  }
  return process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';
}

export function currentDbConfig() {
  return DB_ENVIRONMENTS[resolveDbEnv()];
}
