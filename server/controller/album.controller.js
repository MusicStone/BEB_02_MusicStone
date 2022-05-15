const AlbumService = require("../services/album.services");

// AlbulList & StoneList
exports.album_album_id_get = async (req, res, next) => {
  try {
    const albumId = req.params.album_id;
    const userId = req.query.userId;
    // album $ stone정보 & 좋아요(true/false)
    const AlbumInfo = await AlbumService.getAlbumInfo(albumId, userId);
    res.status(200).json(AlbumInfo);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Album isLike
exports.album_album_id_post = async (req, res, next) => {
  try {
    const likeInfo = req.body;
    console.log(likeInfo);
    const isOk = await AlbumService.updateLike(likeInfo);
    isOk.acknowledged
      ? res.status(201).json({ message: "ok" })
      : res.status(500).json({ message: "fail" });
  } catch (e) {
    throw Error(e);
  }
};

// AlbumInsert
exports.album_register_post = async (req, res, next) => {
  try {
    const albumInfo = req.body;
    const fileInfo = req.file;
    const account = req.params.account;
    const isOk = await AlbumService.insertAlbum(albumInfo, fileInfo, account);
    isOk
      ? res.status(201).json({
          message: "앨범 등록이 완료되었습니다.",
          success: true,
        })
      : res.status(500).json({
          message: "이미 등록된 앨범입니다.",
          success: false,
        });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
