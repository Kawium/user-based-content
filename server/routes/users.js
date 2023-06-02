import express from "express";
import { secure } from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

const router = express.Router();

router.get("/", secure, async (req, res) => {
  try {
    const user = await userModel.findById(req.session.user);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to retrieve user.");
  }
});

router.get("/loggedinUser", secure, (req, res) => {
  try {
    res.json(req.session.user);
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to retrieve logged in user.");
  }
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const registeredUser = new userModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await registeredUser.save();
    res.json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(204).send("Error: Username already exists.");
    } else {
      res.send("Error: Failed to create user.");
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(id, req.body);
    res.json({
      old: user,
      new: req.body,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.send("Error: Username already exists.");
    } else {
      res.send("Error: Failed to update user.");
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send("Error: User not found!");
    }
    res.json(user);
  } catch (err) {
    res.send("Error: Failed to retrieve user.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removedUser = await userModel.findByIdAndRemove(id);
    if (!removedUser) {
      res.send("Error: User with specified ID does not exist!");
    } else {
      res.send("User removed!");
    }
  } catch (err) {
    res.send("Error: Failed to remove user.");
  }
});

router.post("/login", async (req, res) => {
  try {
    req.session.user = undefined;
    const foundUser = await userModel
      .findOne({ username: req.body.username })
      .select("+password");

    if (!foundUser) {
      return res.status(401).send("Error: Wrong password or username.");
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).send("Error: Wrong password or username.");
    }

    if (req.session.user) {
      return res.status(401).send("Error: Already logged in.");
    }

    req.session.user = foundUser;
    res.json(foundUser);
  } catch (err) {
    res.send("Error: Failed to log in.");
  }
});

router.get("/login", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Error: You are not logged in.");
  }
  res.send(req.session);
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.send("Logged out!");
});

export default router;
