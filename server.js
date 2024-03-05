const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!  Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

// setting mongodb connection string
const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    //console.log(connection.connections);
    console.log("mongodb for CodersLeague is connected!!");
  });
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

console.log("Environment:-", app.get("env"));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
