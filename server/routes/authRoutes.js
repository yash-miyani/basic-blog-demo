const express = require("express");
const { handleRegister, handleLoginUser, handleUpdateUser, handleDeleteUser, handleGetAllUser } = require("../controllers/authController");
const { restrictTo, fetchUser } = require("../middleware/auth");

const router = express.Router();

// register
router.post("/register", handleRegister);

// login
router.post("/login", handleLoginUser);

// Update User
router.put("/:id",fetchUser,  restrictTo(["Admin"]), handleUpdateUser);

// Delete User
router.delete("/:id",fetchUser, restrictTo(["Admin"]), handleDeleteUser);

// Get All User
router.get("/all",fetchUser, restrictTo(["Admin"]), handleGetAllUser);


module.exports = router;