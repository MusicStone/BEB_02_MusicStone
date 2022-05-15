const { UserModel, MusicianModel } = require("../models/index");
const ServiceContract = require("../contracts/ServiceContract");

// getUserInfo
const getUserInfo = async (id) => {
  try {
    return await UserModel.find({ id });
  } catch (e) {
    throw Error(e);
  }
};

// insertUser and getUserId
const getUserId = async (account) => {
  try {
    const User = new UserModel({ account });
    const user = await UserModel.findOne({ account });
    return user ? user : User.save();
  } catch (e) {
    throw Error(e);
  }
};

// registerMusician ( sns추가하기 )
const insertMusician = async (musicianInfo, fileInfo) => {
  try {
    let { userId, KName, EName, email, description, account } = musicianInfo;
    const { filename, originalname, path } = fileInfo;
    const isMusician = (
      await UserModel.findOne({ account }, { musician_id: 1, _id: 0 })
    ).musician_id;
    if (isMusician === 0) {
      const isMint = await ServiceContract.addMinter(account);
      if (isMint) {
        const Musician = new MusicianModel({
          name_korea: KName,
          name_english: EName,
          email,
          description,
          filename,
          originalname,
          path,
        });
        const isIn = await Musician.save();
        return isIn !== {}
          ? await UserModel.updateOne({ id: userId }, { musician_id: isIn.id })
          : {};
      } else {
        return "Fail";
      }
    } else {
      return "Double";
    }
  } catch (e) {
    throw Error(e);
  }
};

const updateDeposit = async (account) => {
  try {
    const deposit = await ServiceContract.getUserDeposit(account);
    if (deposit) {
      const isIn = await UserModel.updateOne(
        { account },
        { $set: { deposit: deposit } }
      );
      return isIn === {} ? false : true;
    } else {
      return false;
    }
  } catch (e) {
    throw Error(e);
  }
};
module.exports = {
  getUserId,
  getUserInfo,
  insertMusician,
  updateDeposit,
};
