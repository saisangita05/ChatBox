const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const http = require("http");

const app = express();
// const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  console.log("cors function runnning");
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const server = app.listen(port, () => console.log(`Listening ${port}`));
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:8081", "http://192.168.35.179:8081","http://localhost:8081"], // Allow any origin for testing purposes. This should be changed on production.
  },
});

mongoose
  .connect("mongodb://localhost:27017/chatApp", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB", error));

const User = require("./models/user");
const Message = require("./models/message");

app.post("/register", async (req, res) => {
  try {
    const { name, mobile, password, image } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ name, mobile, password, image });

    await newUser.save();
    console.log("User registered successfully");
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate key error", error);
      res
        .status(400)
        .json({ message: "User with this mobile number already exists" });
    } else {
      console.error("Error creating user", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(401).json({ message: "Incorrect Mobile Number" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    console.log("User logged in successfully");
    const secretKey = crypto.randomBytes(32).toString("hex");
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (err) {
    console.log("Error logging in user", err);
    res.status(500).json({ message: "Error logging in user" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const users = await User.find({ _id: { $ne: userId } }).select(
      "name mobile image requests friends"
    );

    const usersWithPendingRequests = users.filter(
      (user) => user.requests.length === 0 && user.friends.length === 0
    );

    const filteredUsers = users
      .map((user) => {
        user.requests = user.requests.filter(
          (request) => request.from.toString() !== userId
        );
        return user;
      })
      .filter((user) => !user.friends.includes(userId));

    console.log(usersWithPendingRequests);
    console.log(filteredUsers);

    // Combine the two arrays and ensure uniqueness
    const uniqueUsersMap = new Map();

    filteredUsers.forEach((user) =>
      uniqueUsersMap.set(user._id.toString(), user)
    );
    usersWithPendingRequests.forEach((user) =>
      uniqueUsersMap.set(user._id.toString(), user)
    );

    const resultUsers = Array.from(uniqueUsersMap.values());

    res.json(resultUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// get request for getting information of the user
app.get("/information/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select(
      "name mobile image friends"
    );

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error Wil getting information");
  }
});

app.post("/sendrequest", async (req, res) => {
  const { senderId, receiverId } = req.body;
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  receiver.requests.push({ from: senderId });
  await receiver.save();
  console.log("Request Sent");
  res.status(200).json({ message: "Request successfully saved" });
});

app.get("/getrequests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      "requests.from",
      "name mobile image"
    );
    if (user) {
      res.json(user.requests);
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.post("/acceptrequest", async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { requests: { from: requestId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Request Not Found" });
    }

    await User.findByIdAndUpdate(userId, { $push: { friends: requestId } });
    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: { friends: userId },
    });

    if (!friendUser) {
      return res.status(404).json({ message: "Friend not found" });
    }
    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      "friends",
      "name mobile image"
    );
    if (user) {
      res.json(user.friends);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.log("Error fetching user", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiverMessage", { senderId, message });
    }
  });
});
