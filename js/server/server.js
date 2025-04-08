const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api/tasks", tasksRouter);

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/todo-list", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
