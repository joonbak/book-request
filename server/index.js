const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.URL,
  },
});

const PORT = process.env.PORT;
const credentials = process.env.CREDENTIALS;
const tokenSecret = process.env.TOKEN_SECRET;

let books = [];

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === credentials) {
    const token = jwt.sign({ user: "koorong" }, tokenSecret, {
      expiresIn: "6h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/requests", (req, res) => {
  res.json(books);
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} has connected`);

  socket.on("book_request", (data) => {
    books.push(data);
    socket.broadcast.emit("receive_request", data);
  });
  socket.on("delete_request", (id) => {
    books = books.filter((book) => book.id !== id);
    socket.broadcast.emit("book_deleted", id);
  });
  socket.on("status_request", (data) => {
    const { id, newStatus } = data;
    const book = books.find((book) => book.id === id);
    if (book) {
      book.status = newStatus;
    }
    socket.broadcast.emit("status_changed", book);
  });
  socket.on("disconnect", (reason) => {
    console.log(`User ${socket.id} has disconnected: ${reason}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
