const {
  AlbumModel,
  UserModel,
  StoneModel,
  MusicianModel,
} = require("../models/index");

// getAlbumInfo & getAlbumStoneInfo
const getAlbumInfo = async (albumId, userId) => {
  try {
    const albumInfo = await AlbumModel.findOne({ id: albumId });
    const musicianInfo = await MusicianModel.findOne(
      { id: albumInfo.musician_id },
      { name_korea: 1, name_english: 1, originalname: 1, _id: 0 }
    );
    const stoneList = await StoneModel.find(
      { album_id: albumId },
      { _id: 0, release_date: 0, __v: 0 }
    );
    let stonesIsLikeList = [];
    for (let stone of stoneList) {
      const isLike = stone.like.indexOf(userId) !== -1 ? true : false;
      stonesIsLikeList.push(isLike);
    }
    // Album 좋아요 여부
    let isLike = await AlbumModel.find({
      $and: [{ like: userId }, { id: albumId }],
    });
    isLike = isLike = isLike.length === 0 ? false : true;
    return { musicianInfo, albumInfo, stoneList, stonesIsLikeList, isLike };
  } catch (e) {
    throw Error(e);
  }
};

// like or unlike
const updateLike = async (likeInfo) => {
  try {
    const { type, likeId, userId, isLike } = likeInfo;
    const model = type === "album" ? AlbumModel : StoneModel;
    let isOk;
    if (isLike) {
      if (userId !== null && userId !== "" && userId !== undefined) {
        isOk = await model.update(
          { id: likeId },
          { $addToSet: { like: [userId] } }
        );
      } else {
        isOk = { acknwledged: false };
      }
    } else {
      isOk = await model.updateOne({ id: likeId }, { $pull: { like: userId } });
    }
    return isOk;
  } catch (e) {
    throw Error(e);
  }
};

// insertAlbum
const insertAlbum = async (albumInfo, fileInfo, account) => {
  try {
    const { albumName, description } = albumInfo;
    const { filename, originalname, path } = fileInfo;
    //account로 musicianId가져오기
    const musician = await UserModel.findOne(
      { account },
      { musician_id: 1, _id: 0 }
    );
    const Album = new AlbumModel({
      musician_id: musician.musician_id,
      name: albumName,
      description,
      filename,
      originalname,
      path,
    });
    return await Album.save();
  } catch (e) {
    throw Error(e);
  }
};

module.exports = {
  insertAlbum,
  getAlbumInfo,
  updateLike,
};
