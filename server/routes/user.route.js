const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "musicians/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const controller = require("../controller/user.controller");
router.get("/", controller.user_get);
router.get("/:user_account", controller.user_account_get);
router.post(
  "/register",
  upload.single("musicianfile"),
  controller.user_register_post
);
router.post("/deposit/:account", controller.user_deposit_post);

module.exports = router;
