import postModel from "../models/post.model.js";

// Authentication to check if the user is logged in
export function secure(req, res, next) {
  console.log(req.session.user);
  if (req.session.user) {
    next();
  } else {
    res.status(401).json("You must be logged in.");
  }
}

// Authentication for the posts: only the user with the right ID can delete or edit their own post
export async function postAuth(req, res, next) {
  try {
    const post = await postModel.findById(req.params.id);
    if (req.session.user._id === post.user._id.toString()) {
      next();
    } else {
      res.status(401).json("This is not your post!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: Failed to authenticate post.");
  }
}
