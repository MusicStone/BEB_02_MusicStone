const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "stones/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const stones = multer({ storage });
const controller = require("../controller/stones.controller");

router.get("/:user_account", controller.stones_get);
router.get("/mystone/:user_id", controller.stones_mystone_get);
router.post("/mystone/:user_id", controller.stones_mystone_post);
router.get("/buystone/:user_id", controller.stones_buystone_get);
router.get("/info/:musicstone_id", controller.stones_info_get);
router.get("/tradestone/:musicstone_id", controller.stones_tradestone_get);
router.post("/tradestone/:musicstone_id", controller.stones_tradestone_post);
router.post(
  "/register/:account",
  stones.single("stonefile"),
  controller.stones_register_post
);
router.post("/distribution", controller.stones_distribution_post);

module.exports = router;
