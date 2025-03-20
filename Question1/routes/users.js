const express = require("express");
const { getTopUsers } = require("../controllers/usersController");
const router = express.Router();

router.get("/", getTopUsers); // Users

module.exports = router;
