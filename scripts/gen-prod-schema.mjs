import { readFileSync, writeFileSync } from 'node:fs';
import { DB_ENVIRONMENTS } from '../config/db.config.mjs';

const source = DB_ENVIRONMENTS.dev;
const target = DB_ENVIRONMENTS.prod;

const schema = readFileSync(source.schemaPath, 'utf8');

const replaced = schema.replace(
  `provider = "${source.provider}"`,
  `provider = "${target.provider}"`
);

if (replaced === schema) {
  throw new Error(
    `gen-prod-schema: expected to find provider = "${source.provider}" in ${source.schemaPath} — schema may have already been edited or the source provider changed.`
  );
}

writeFileSync(target.schemaPath, replaced);
console.log(`Generated ${target.schemaPath} (${source.provider} -> ${target.provider})`);
