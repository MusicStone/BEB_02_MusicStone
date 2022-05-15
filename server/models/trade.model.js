const mongoose = require("mongoose");
const { Schema } = mongoose;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const TradeSchema = new Schema({
  id: { type: Number, required: true },
  stone_id: { type: Number, required: true },
  sell_user_account: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  open_date: { type: Date, required: true, default: Date.now },
  closed: { type: Number, required: true, default: 0 }, // 0: Opened, 1:Sold out, 2:Cancel
  item_id: Number,
});
TradeSchema.plugin(autoIncrement.plugin, {
  model: "Trade",
  field: "id",
  startAt: 1, //시작
  increment: 1, // 증가
});

module.exports = {
  TradeModel: mongoose.model("Trade", TradeSchema),
};
