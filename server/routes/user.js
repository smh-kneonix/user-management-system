const express = require("express");
const bodyparser = require("body-parser");
const {
    getAllUser,
    findUser,
    addUserForm,
    editUserById,
    editUserPage,
    deleteUserById,
    viewUserById
} = require("../controllers/user.controller");
const router = express.Router();

// set request and route
router.get("/", getAllUser);
router.post("/", bodyparser.urlencoded({ extended: false }), findUser);
router.post(
    "/adduser",
    bodyparser.urlencoded({ extended: false }),
    addUserForm
);
router.get("/edituser/:id", editUserPage);
router.post(
    "/edituser/:id",
    bodyparser.urlencoded({ extended: false }),
    editUserById
);
router.get("/viewuser/:id",viewUserById)
router.get(
    "/deleteuser/:id",
    deleteUserById
);
module.exports = router;
