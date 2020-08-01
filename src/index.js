const app = require("./app"); // the actual Express application
const http = require("http");
const { PORT, AUTH_API_DB } = require("./utils/config");

//use config module to get the app uri, if no app uri set, end the application
if (!AUTH_API_DB) {
  console.error("FATAL ERROR: YOUR_APP_MONGODB_URI is not defined in .env.");
  process.exit(1);
}

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
