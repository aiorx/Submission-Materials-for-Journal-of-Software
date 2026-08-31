import User from "../models/user.js";
import jwt from "jsonwebtoken";
import fs from "fs";

/* Most of this codeblock was Assisted using common GitHub development aids :O */
// handle errors
const handleErrors = (err) => {
  const errors = {username: "", email: "", password: ""};
  if (err.code === 11000) {
    errors.username = "Username or email already taken";
    return errors; // return errors object
  }
  // if validation errors
  if (err.errors) {
    for (const field in err.errors) {
      errors[field] = err.errors[field].properties.message;
    }
  }
  return errors;
};
const maxAge = 7 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const createUser = async (req, res) => {
  const {username, password, email} = req.body;
  console.log(username, password, email);
  try {
    const user = await new User({
      username: username,
      password: password,
      email: email,
      fullname: username,
      profile_picture: "default.png",
      date_registered: new Date(),
    });
    await user.save();
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(201).send({user: user._id});
  } catch (err) {
    const errs = handleErrors(err);
    if (email == "") errs["email"] = "";
    res.status(400).send(errs);
  }
};

const editUser = async (req, res) => {
  const {username} = req.params;
  let {fullname, email} = req.body;
  try {
    const user = await User.findOne({username: username});

    if (!user) {
      return res.status(404).send({message: "User not found"});
    }

    await user.updateOne({
      fullname: fullname ?? user.fullname,
      email: email ?? user.email,
    });
    res.status(201).send({user: user._id});
  } catch (err) {
    res.status(400).send(err);
  }
};

const editUserPicture = async (req, res) => {
  const {username} = req.params;
  const picture = req.file;
  try {
    const user = await User.findOne({username: username});
    if (!user) {
      return res.status(404).send({message: "User not found"});
    }
    if (!picture) {
      return res.status(400).send({message: "No picture provided"});
    }
    const suffix = picture.originalname.split(".").pop();

    // First delete the old picture if it exists
    if (user.profile_picture && user.profile_picture !== "default.png") {
      fs.unlink(user.profile_picture, (err) => {
        if (err) console.error("Error deleting old picture:", err);
      });
    }

    await user.updateOne({
      profile_picture: `${picture.filename}_thumb.${suffix}` ?? "default.png",
    });
    res.status(201).send({user: user._id});
  } catch (error) {
    console.error("Error updating user picture:", error);
    res.status(500).send({message: "Internal server error"});
  }
};

const login = async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).send({user: user._id, token: token});
  } catch (err) {
    res.status(400).json({message: err.message});
  }
};

const logOut = (req, res) => {
  res.clearCookie("jwt", res.locals.user.token, {
    httpOnly: true,
    maxAge: maxAge * 1000,
  });
  res.status(200).send("Logged out");
};

const authorize = async (req, res) => {
  if (res.locals.user?.id) {
    const user = await User.findById(res.locals.user.id);
    await res.status(200).send({user: user});
  } else {
    res.status(401).send({message: "Unauthorized"});
  }
};

const findUserByName = async (req, res) => {
  const {username} = req.params;
  const user = await User.findOne({username: username});
  await res.status(200).send({user: user});
};

const addFavoriteRestaurant = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(res.locals.user.id);
  if (!user) {
    return res.status(404).send({message: "User not found"});
  }
  if (!user.favorite_restaurants.includes(id)) {
    user.favorite_restaurants.push(id);
    await user.save();
  }
  res
    .status(200)
    .send({message: "Restaurant added to favorites", status: "success"});
};

const removeFavoriteRestaurant = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(res.locals.user.id);
  if (!user) {
    return res.status(404).send({message: "User not found"});
  }
  if (user.favorite_restaurants.includes(id)) {
    user.favorite_restaurants = user.favorite_restaurants.filter(
      (restaurant) => restaurant !== id
    );
    await user.save();
  }
  res
    .status(200)
    .send({message: "Restaurant removed from favorites", status: "success"});
};

export {
  findUserByName,
  createUser,
  editUser,
  login,
  logOut,
  authorize,
  editUserPicture,
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
};
