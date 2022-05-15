const express = require("express");
const router = express.Router();
const controller = require("../controller/musician.controller");

router.get("/", controller.musician_get);
router.get("/random", controller.musician_random_get);
router.get("/:musician_id", controller.musician_musician_id_get);
router.post("/:musician_id", controller.musician_musician_id_post);

module.exports = router;
