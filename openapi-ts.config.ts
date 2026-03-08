import { defineConfig } from '@hey-api/openapi-ts';
import dotenv from 'dotenv';

// Load variables from .env
dotenv.config();

export default defineConfig({
  input: `${process.env.REACT_APP_API_BASE}/swagger/json`, // Path to your NestJS file
  output: './src/api-client',           // Where the generated code will go
  plugins: [
    '@hey-api/client-axios',            // Explicitly enable Axios support
  ],
  // Test
});
