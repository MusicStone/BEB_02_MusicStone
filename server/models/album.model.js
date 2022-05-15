const mongoose = require("mongoose");
const { Schema } = mongoose;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const AlbumSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  musician_id: Number,
  name: String,
  like: { type: [Number], default: [] },
  release_date: { type: Date, default: Date.now },
  titleStoneId: { type: Number, default: 0 },
  description: { type: String, default: "None" },
  filename: String,
  originalname: String,
  path: String,
});
AlbumSchema.plugin(autoIncrement.plugin, {
  model: "Album",
  field: "id",
  startAt: 1, //시작
  increment: 1, // 증가
});

module.exports = {
  AlbumModel: mongoose.model("Album", AlbumSchema),
};
