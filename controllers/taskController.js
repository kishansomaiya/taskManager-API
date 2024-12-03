const { v4: uuidv4 } = require("uuid");
const { readTasks, writeTasks } = require("../config/db");

const getAllTasks = (req, res) => {
  const tasks = readTasks();
  res.status(200).json(tasks);
};

const createTask = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const tasks = readTasks();
  const newTask = { id: uuidv4(), title, description, status: "pending" };
  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json({ message: "Task created successfully", task: newTask });
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { status, description, title } = req.body;

  if (!["pending", "onHold", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex].status = status;
  if(description){
    tasks[taskIndex].description = description
  }
  if(title){
    tasks[taskIndex].title = title
  }
  writeTasks(tasks);

  res.status(200).json({ message: "Task updated successfully", task: tasks[taskIndex] });
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  writeTasks(tasks);

  res.status(200).json({ message: "Task deleted successfully" });
};

const filterTasksByStatus = (req, res) => {
  const { status } = req.params;

  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const tasks = readTasks();
  const filteredTasks = tasks.filter((task) => task.status === status);
  res.status(200).json(filteredTasks);
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  filterTasksByStatus,
};
