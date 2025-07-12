import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials:{
    url: 'postgresql://neondb_owner:npg_8ziWPFL1OHRv@ep-morning-mouse-a55kufnc-pooler.us-east-2.aws.neon.tech/ai%20mock?sslmode=require',
  }
});
