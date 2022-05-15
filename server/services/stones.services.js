const {
  StoneModel,
  UserModel,
  TradeModel,
  AlbumModel,
  MusicianModel,
} = require("../models/index");
const ServiceContract = require("../contracts/ServiceContract");

// AlbumList({id, name})
const getAlbumList = async (userAccount) => {
  try {
    const musician_id = (
      await UserModel.findOne({ account: userAccount }, { musician_id: 1 })
    ).musician_id;
    const albumList = await AlbumModel.find(
      { musician_id },
      { id: 1, name: 1, _id: 0 }
    );
    return albumList;
  } catch (e) {
    throw Error(e);
  }
};

// getUserStone
const getMyStoneList = async (userId) => {
  try {
    // userId로 userAccount가져와서 가진 stone조회
    const user = await UserModel.findOne(
      { id: userId },
      { account: 1, musician_id: 1, _id: 0 }
    );
    // user의 musician여부 반환
    const isMusician = user.musician_id === 0 ? false : true;

    if (user) {
      const userAccount = user.account;
      console.time("label");
      // Contract에서 userAccount가 가진 SFTList 가져오기
      const myStoneList = await ServiceContract.getMySFTs(userAccount);
      console.timeEnd("label");
      if (myStoneList !== []) {
        const tokenInfo = myStoneList.map((el) => {
          return { token_id: el[0], userBalance: el[1] };
        });

        const myStoneInfo = tokenInfo.sort(function (a, b) {
          return Number(a.token_id) - Number(b.token_id);
        });

        // stoneIdList
        let stoneIdList = [];
        for (let stone of myStoneInfo) {
          stoneIdList.push(
            (
              await StoneModel.findOne(
                { token_id: stone.token_id },
                { id: 1, _id: 0 }
              )
            ).id
          );
        }

        // albumImg
        let albumIdList = [];
        for (let id of stoneIdList) {
          albumIdList.push(
            (await StoneModel.findOne({ id }, { album_id: 1, _id: 0 })).album_id
          );
        }
        let albumInfo = [];
        for (let id of albumIdList) {
          albumInfo.push(
            (await AlbumModel.findOne({ id }, { originalname: 1, _id: 0 }))
              .originalname
          );
        }

        // stone & musician join
        const info = await StoneModel.aggregate([
          {
            $lookup: {
              from: "musicians",
              let: {
                musician_id: "$musician_id",
                name_korea: "$name_k",
                name_english: "$name_e",
                originalname: "$originalname",
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
        const stoneInfo = info.filter((el) => {
          return stoneIdList.includes(el.id);
        });
        return { stoneInfo, myStoneInfo, albumInfo, isMusician };
      }
    } else {
      return "";
    }
  } catch (e) {
    throw Error(e);
  }
};

// insertTradeStone - 0402완료
const insertTrade = async (sellStoneInfo, userId) => {
  const { stoneId, seller, quantity, unitPrice, itemId } = sellStoneInfo;
  // sell_user_id -> sell_user_account로 수정
  try {
    const Trade = new TradeModel({
      stone_id: stoneId,
      sell_user_account: seller,
      price: unitPrice,
      amount: quantity,
      item_id: itemId,
    });
    return await Trade.save();
  } catch (e) {
    throw Error(e);
  }
};

// insertStone
const insertStone = async (stoneInfo, fileInfo, account) => {
  try {
    const {
      albumId,
      stoneName,
      description,
      lyricist,
      composer,
      lyrics,
      category,
      totalBalance,
      tokenId,
    } = stoneInfo;
    const { filename, originalname, path } = fileInfo;
    // account로 UserModel에서 musician_id찾기
    const musicianId = await UserModel.findOne(
      { account: account },
      { musician_id: 1 }
    );
    // stone저장
    const Stone = new StoneModel({
      musician_id: musicianId.musician_id,
      name: stoneName,
      album_id: albumId,
      description,
      lyricist,
      composer,
      lyrics,
      category,
      total_balance: totalBalance,
      token_id: Number(tokenId),
      filename,
      originalname,
      path,
    });
    return await Stone.save();
  } catch (e) {
    throw Error(e);
  }
};

// getSellStoneList (+ 검색)
const getSellStone = async (userId, listInfo) => {
  const { startIndex, endIndex, keyword } = listInfo;
  let account = "";
  if (userId != 0) {
    account = (await UserModel.findOne({ id: userId }, { account: 1, _id: 0 }))
      .account;
  }
  try {
    if (keyword === undefined || keyword === "") {
      const sellList = await TradeModel.find(
        { closed: 0 },
        { id: 1, stone_id: 1, price: 1, item_id: 1, amount: 1, _id: 0 }
      )
        .skip(startIndex - 1)
        .limit(endIndex - startIndex + 1);

      if (sellList !== []) {
        let stoneIdList = [];
        for (el of sellList) {
          stoneIdList.push(el.stone_id);
        }

        const stoneInfo = [];
        for (id of stoneIdList) {
          stoneInfo.push(
            await StoneModel.findOne(
              { id },
              {
                id: 1,
                name: 1,
                musician_id: 1,
                album_id: 1,
                token_id: 1,
                _id: 0,
              }
            )
          );
        }

        let musicianInfo = [];
        for (el of stoneInfo) {
          musicianInfo.push(
            await MusicianModel.findOne(
              { id: el.musician_id },
              { name_korea: 1, name_english: 1, _id: 0 }
            )
          );
        }

        let albumImgList = [];
        for (el of stoneInfo) {
          albumImgList.push(
            await AlbumModel.findOne(
              { id: el.album_id },
              { originalname: 1, _id: 0 }
            )
          );
        }
        let userBalanceList = [];
        if (account !== "") {
          for (el of stoneInfo) {
            userBalanceList.push(
              await ServiceContract.getUserSFTs(account, el.token_id)
            );
          }
        }
        return {
          sellList,
          stoneInfo,
          musicianInfo,
          albumImgList,
          userBalanceList,
        };
      } else {
        return {};
      }
    } else {
      // 검색있는경우;
      const regex = (pattern) => new RegExp(`.*${pattern}.*`);
      const keywordRegex = regex(keyword);
      const query = {
        name: { $regex: keywordRegex, $options: "i" },
      };
      const stoneIdList = (await StoneModel.find(query, { id: 1 })).map(
        (el) => el.id
      );

      const AllList = await TradeModel.find(
        { closed: 0 },
        { id: 1, stone_id: 1, price: 1, item_id: 1, amount: 1, _id: 0 }
      )
        .skip(startIndex - 1)
        .limit(endIndex - startIndex + 1);

      const sellList = AllList.filter((el) => {
        return stoneIdList.includes(el.stone_id);
      });

      // 중복코드
      if (sellList !== []) {
        let stoneIdList = [];
        for (el of sellList) {
          stoneIdList.push(el.stone_id);
        }

        const stoneInfo = [];
        for (id of stoneIdList) {
          stoneInfo.push(
            await StoneModel.findOne(
              { id },
              {
                id: 1,
                name: 1,
                musician_id: 1,
                album_id: 1,
                token_id: 1,
                _id: 0,
              }
            )
          );
        }

        let musicianInfo = [];
        for (el of stoneInfo) {
          musicianInfo.push(
            await MusicianModel.findOne(
              { id: el.musician_id },
              { name_korea: 1, name_english: 1, _id: 0 }
            )
          );
        }

        let albumImgList = [];
        for (el of stoneInfo) {
          albumImgList.push(
            await AlbumModel.findOne(
              { id: el.album_id },
              { originalname: 1, _id: 0 }
            )
          );
        }

        let userBalanceList = [];
        if (account !== "") {
          for (el of stoneInfo) {
            userBalanceList.push(
              await ServiceContract.getUserSFTs(account, el.token_id)
            );
          }
        }
        return {
          sellList,
          stoneInfo,
          musicianInfo,
          albumImgList,
          userBalanceList,
        };
      } else {
        return {};
      }
    }
  } catch (e) {
    throw Error(e);
  }
};

// getStoneDetail & getStoneTradeInfo
const getStoneDetail = async (stoneId) => {
  try {
    const stoneDetail = await StoneModel.findOne({ id: stoneId });
    const sellList = await TradeModel.find(
      { stone_id: stoneId, closed: 0 },
      {
        id: 1,
        sell_user_account: 1,
        amount: 1,
        price: 1,
        musician_id: 1,
        item_id: 1,
        _id: 0,
      }
    );
    const musician = await MusicianModel.findOne(
      {
        id: stoneDetail.musician_id,
      },
      { image: 1, name_korea: 1, name_english: 1, _id: 0 }
    );

    const albumImg = (
      await AlbumModel.findOne(
        { id: stoneDetail.album_id },
        { originalname: 1, _id: 0 }
      )
    ).originalname;

    const minPrice = Math.min.apply(
      null,
      sellList
        .filter((el) => {
          return el.price !== undefined;
        })
        .map((el) => Number(el.price))
    );
    return { stoneDetail, musician, albumImg, sellList, minPrice };
  } catch (e) {
    throw Error(e);
  }
};

// updateBuyStoneInfo (+ contract는 client에서 수행. 수행후 어떤 정보 저장할 것인가)
const updateBuyStoneInfo = async (tradeInfo, stoneId) => {
  try {
    const { quantity, tradeId } = tradeInfo;
    const TradeInfo = await TradeModel.findOne(
      { id: tradeId },
      { amount: 1, _id: 0 }
    );
    const remainAmount = TradeInfo.amount - quantity;
    let isOk = "";
    if (remainAmount === 0) {
      // 해당거래 closed
      isOk = await TradeModel.updateOne(
        { id: tradeId },
        { $set: { closed: 1 } }
      );
    } else {
      // 해당거래 amountUpdate
      isOk = await TradeModel.updateOne(
        { id: tradeId },
        { $set: { amount: remainAmount } }
      );
    }
    return isOk.modifiedCount;
  } catch (e) {
    throw Error(e);
  }
};

// db내용 업댓 추가하기
const Updatedistribution = async () => {
  try {
    // function deduction([address], [deduct_token]) public [주소]와 [차감할 토큰금액](스트리밍한 횟수만큼)
    const user = await UserModel.find(
      {
        deduction: { $gt: 0 },
      },
      { account: 1, deduction: 1, _id: 0 }
    );
    const userAccoutList = user.map((el) => {
      return el.account;
    });
    const deductionList = user.map((el) => {
      return ServiceContract.toPeb(el.deduction);
    });
    const isOk = await ServiceContract.deduction(userAccoutList, deductionList);

    // function distribution([_sft_token], [distribute_amount]) [tokenId]랑 [해당토큰아이디로 분배될토큰]
    const stone = await StoneModel.find(
      {
        streaming_count: { $gt: 0 },
      },
      { token_id: 1, streaming_count: 1, _id: 0 }
    );
    const tokenList = stone.map((el) => {
      return el.token_id;
    });
    // 조건: 1곡당 1토큰 가정
    const distributionTokenList = stone.map((el) => {
      return ServiceContract.toPeb(el.streaming_count);
    });
    const isGood = await ServiceContract.distribution(
      tokenList,
      distributionTokenList
    );

    // 분배뒤에 userdb의 deduction & stonedb streaming_account 0으로 업데이트해주기
    if (isOk && isGood) {
      const userUp = await UserModel.update(
        {},
        { $set: { deduction: 0 } },
        { multi: true }
      );
      const stoneUp = await StoneModel.update(
        {},
        { $set: { streaming_count: 0 } },
        { multi: true }
      );
      return userUp && stoneUp ? "Ok" : "Fail";
    } else {
      return "Fail";
    }
  } catch (e) {
    throw Error(e);
  }
};

module.exports = {
  insertStone,
  getMyStoneList,
  insertTrade,
  getSellStone,
  getStoneDetail,
  getAlbumList,
  updateBuyStoneInfo,
  Updatedistribution,
};
