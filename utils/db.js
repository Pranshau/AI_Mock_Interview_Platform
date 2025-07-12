import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon("postgresql://neondb_owner:npg_8ziWPFL1OHRv@ep-morning-mouse-a55kufnc-pooler.us-east-2.aws.neon.tech/ai%20mock?sslmode=require");


export const db = drizzle({ client: sql },{schema});