const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  note: { type: String, default: "" },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
