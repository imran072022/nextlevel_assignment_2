import { app } from "./app.js";
import { config } from "./config/index.js";
import { initDB } from "./db/index.js";

const runServer = () => {
  initDB();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};
runServer();
