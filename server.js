import app from "./app.js";
import database_connect from "./database/database.js";
import { PORT } from "./config/env.js";

let server;
const run_server = async () => {
  try {
    server = await app.listen(PORT, async () => {
      await database_connect();
      console.info(`Initializing server on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

const handleServerShutdown = async (eventName, error) => {
  console.warn(`Server received ${eventName} signal. Closing server...`);

  // Attempt to close the server
  try {
    if (server) {
      server.close(() => {
        console.info("Server closed gracefully.");
        if (error) {
          console.error("Error during shutdown:", error);
        }
        process.exit(0); // Exit after server shuts down
      });
    }
  } catch (shutdownError) {
    console.error("Error while shutting down server:", shutdownError);
    process.exit(1); // Exit with error status if server shutdown fails
  }
};

// Handle various process signals and errors
process.on("SIGINT", async () => handleServerShutdown("SIGINT"));
process.on("SIGTERM", async () => handleServerShutdown("SIGTERM"));
process.on("unhandledRejection", async (error) => {
  console.error("Unhandled Rejection:", error);
  handleServerShutdown("unhandledRejection", error);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  handleServerShutdown("uncaughtException", error);
});

// Start the server

run_server();
