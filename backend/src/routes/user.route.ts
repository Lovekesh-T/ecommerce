import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  userRegister,
} from "../controllers/user.controller.js";

import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
// register new user
router.route("/register").post(userRegister);

// get all users
router.route("/all").get(isAdmin, getAllUsers);

//get and delete user
router.route("/:id").get( getUser).delete(deleteUser);

export default router;
