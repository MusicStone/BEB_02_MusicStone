const MusicianService = require("../services/musician.services");

// musicianList
exports.musician_get = async (req, res, next) => {
  const musicianReq = req.query;
  try {
    const musicianList = await MusicianService.getMusicians(musicianReq);
    if (musicianList) {
      return res.status(201).json({ data: musicianList, message: "Success" });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// randomMusician
exports.musician_random_get = async (req, res, next) => {
  const musicianReq = req.query;
  try {
    const musicianList = await MusicianService.getMusicians(musicianReq);
    var musicianRandomList = [];
    while (musicianRandomList.length < 4) {
      var randomMusician = musicianList.splice(
        Math.floor(Math.random() * musicianList.length),
        1
      )[0];
      musicianRandomList.push(randomMusician);
    }
    if (musicianRandomList) {
      return res
        .status(201)
        .json({ data: musicianRandomList, message: "Success" });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// musicianInfo, AlnumInfo, isLike
exports.musician_musician_id_get = async (req, res, next) => {
  const userId = req.query.userId;
  const musicianId = req.params.musician_id;
  try {
    // musician정보
    const musicianInfo = await MusicianService.getMusicianInfo(musicianId);
    // musician이 발매한 album정보
    const albumInfo = await MusicianService.getAlbumInfo(musicianId);
    // 좋아요(true/false)
    const isLike = await MusicianService.getLike(userId, musicianId);

    if (musicianInfo && albumInfo && isLike !== undefined) {
      res.status(201).json({ data: { musicianInfo, albumInfo, isLike } });
    } else {
      res.status(500).json({ message: e.message });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// like
exports.musician_musician_id_post = async (req, res, next) => {
  const musicianId = req.params.musician_id;
  const { userId, isLike } = req.body;
  try {
    const isOk = await MusicianService.updateLike(musicianId, userId, isLike);
    isOk.acknowledged
      ? res.status(201).json({ message: "ok" })
      : res.status(500).json({ message: "fail" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
