import express from "express";
import { secure, postAuth } from "../middlewares/auth.js";
import postModel from "../models/post.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await postModel
      .find({ user: req.session.user._id })
      .populate("user");
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to retrieve posts.");
  }
});

router.get("/all", async (req, res) => {
  try {
    const posts = await postModel.find({}).populate("user");
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to retrieve posts.");
  }
});

router.post("/", secure, async (req, res) => {
  try {
    const post = new postModel({
      user: req.session.user,
      title: req.body.title,
      text: req.body.text,
      date: req.body.date,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to create post.");
  }
});

router.put("/:id", secure, postAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findByIdAndUpdate(id, req.body);
    res.json({
      old: post,
      new: req.body,
    });
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to update post.");
  }
});

router.delete("/:id", secure, postAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const removedPost = await postModel.findByIdAndRemove(id);
    if (!removedPost) {
      res.send("Error: Post with specified ID does not exist!");
    } else {
      res.send("Post removed!");
    }
  } catch (err) {
    console.log(err);
    res.send("Error: Failed to remove post.");
  }
});

export default router;
