/* global process */

import fs from 'fs';
import { parse } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV = process.env.NODE_ENV || 'development';

const files = [
  '.env',
  '.env.local',
  `.env.${ENV}`,
  `.env.${ENV}.local`,
];

const contents = files.map((envFile) => {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, envFile));
    return parse(file);
  } catch (e) {
    return null;
  }
}).filter(Boolean);

const results = Object.assign({}, ...contents );

const vars = Object.entries(results).map(([ key, value ]) => [ `process.env.${key}`, JSON.stringify(value) ]);

const output = Object.fromEntries(vars);
output['process.env.NODE_ENV'] = JSON.stringify(ENV);

export default output;
