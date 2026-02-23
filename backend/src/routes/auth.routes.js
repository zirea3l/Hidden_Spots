/*const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
export default router;*/

import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
