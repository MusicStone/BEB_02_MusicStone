const {
  PlaylistModel,
  UserModel,
  StoneModel,
  MusicianModel,
} = require("../models/index");
const ServiceContract = require("../contracts/ServiceContract");
// getUserPlaylist (+ musicianInfo 필요한 값들만 추리기, 노래시간불러오기)
const getPlaylist = async (user_id) => {
  try {
    const isIn = await PlaylistModel.findOne({ user_id });
    if (isIn !== null) {
      const stoneArr = (
        await PlaylistModel.findOne({ user_id }, { stone_id_arr: 1 })
      ).stone_id_arr;
      // StonModel에  Musician 조인하기
      const info = await StoneModel.aggregate([
        {
          $lookup: {
            from: "musicians",
            let: {
              musician_id: "$musician_id",
              name_korea: "$name_k",
              name_english: "$name_e",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$id", "$$musician_id"] }],
                  },
                },
              },
            ],
            as: "musicianInfo",
          },
        },
      ]);
      const playInfo = info.filter((el) => {
        return stoneArr.includes(el.id);
      });
      return playInfo;
    } else {
      return "";
    }
  } catch (e) {
    throw Error(e);
  }
};

const getRemainToken = async (user_id) => {
  try {
    const user = await UserModel.findOne(
      { id: user_id },
      { account: 1, deduction: 1, _id: 0 }
    );

    const deposit = await ServiceContract.getUserDeposit(user.account);
    if (user.deduction === undefined) {
      return Number(deposit);
    } else {
      return Number(deposit) - Number(user.deduction);
    }
  } catch (e) {
    throw Error(e);
  }
};
// insertOrUpdatePlaylist
const updatePlaylist = async (user_id, stoneId) => {
  try {
    // 만약 user의 palylist가 존해하면
    const isIn = await PlaylistModel.findOne({ user_id });
    let isOk;
    if (isIn === null) {
      const playList = new PlaylistModel({ user_id });
      await playList.save();
      const isIn = await PlaylistModel.updateOne(
        { user_id },
        { $push: { stone_id_arr: [stoneId] } }
      );
      return isOk;
    } else {
      isOk = await PlaylistModel.updateOne(
        { user_id },
        { $addToSet: { stone_id_arr: stoneId } }
      );
      return isOk.modifiedCount;
    }
  } catch (e) {
    throw Error(e);
  }
};

// getStonePath
const getStonePath = async (id) => {
  try {
    const path = (await StoneModel.findOne({ id }, { path: 1, _id: 0 })).path;
    return path;
  } catch (e) {
    throw Error(e);
  }
};

//
const deletePlayList = async (user_id, stone_id) => {
  try {
    const isDel = await PlaylistModel.updateOne(
      { user_id },
      { $pullAll: { stone_id_arr: [stone_id] } }
    );
    return isDel.modifiedCount;
  } catch (e) {
    throw Error(e);
  }
};

const updateDeduction = async (stone_id, user_id) => {
  try {
    const isOk = await UserModel.updateOne(
      { id: user_id },
      { $inc: { deduction: 1 } }
    );
    const isUp = await StoneModel.updateOne(
      { id: stone_id },
      { $inc: { streaming_count: 1 } }
    );
    let keyword;
    if (isOk.modifiedCount === 1 && isUp.modifiedCount === 1) {
      keyword = "Ok";
    } else if (isOk.modifiedCount === 1 && isUp.modifiedCount === 0) {
      keyword = "Stone isn't Update";
    } else if (isOk.modifiedCount === 0 && isUp.modifiedCount === 1) {
      keyword = "User isn't Update";
    } else {
      keyword = "Fail";
    }
    return keyword;
  } catch (e) {
    throw Error(e);
  }
};

module.exports = {
  getPlaylist,
  updatePlaylist,
  getStonePath,
  deletePlayList,
  updateDeduction,
  getRemainToken,
  updateDeduction,
};
