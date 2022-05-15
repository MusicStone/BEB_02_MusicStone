const express = require("express");
const router = express.Router();
const multer = require("multer");
// const album = multer({ dest: "./albums" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "albums/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const albums = multer({ storage });
const controller = require("../controller/album.controller");

router.get("/:album_id", controller.album_album_id_get);
router.post("/:album_id", controller.album_album_id_post);
router.post(
  "/register/:account",
  albums.single("albumfile"),
  controller.album_register_post
);

module.exports = router;
