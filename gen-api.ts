require('dotenv').config();
const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
  name: "api.ts",
  output: path.resolve(__dirname, "./src/api"),
  url: `${process.env.REACT_APP_API_BASE}/swagger/json`, // Đảm bảo trong .env có dòng REACT_APP_API_BASE=...
  httpClientType: "axios",
   // Cấu hình để lấy Type chính xác (Thay thế cho các flag terminal)
  extractResponseBody: true, // Tương đương --extract-response-body
  extractResponseError: true, // Tương đương --extract-response-error
  unwrapResponseData: true,   // Giúp bóc tách data gọn hơn
})
.catch(console.error);
