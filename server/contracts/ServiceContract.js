require("dotenv").config();
const CaverExtKAS = require("caver-js-ext-kas");
const abi = require("./abi/Service");

const caverExt = new CaverExtKAS();
const chainId = 1001;
caverExt.initKASAPI(
  chainId,
  process.env.ACCESS_KEY_ID,
  process.env.SECRET_ACCESS_KEY
);

const keyringContainer = new caverExt.keyringContainer();
const keyring = keyringContainer.keyring.createWithSingleKey(
  process.env.SERVER_ADDRESS,
  process.env.SERVER_PRIVATE_KEY
);
keyringContainer.add(keyring);

const contract = new caverExt.contract(
  abi,
  process.env.SERVICE_CONTRACT_ADDRESS
);
// Musician으로 등록
const addMinter = async (address) => {
  contract.setWallet(keyringContainer);
  return contract.methods
    .addMinter(address)
    .send({ from: process.env.SERVER_ADDRESS, gas: 2000000 });
};

// Musician인지여부
const isMinter = async (address) => {
  return contract.methods.isMinter(address).call();
};

// user의 예치금액
const getUserDeposit = async (address) => {
  const deposit = await contract.methods.getUserDeposit(address).call();
  return caverExt.utils.fromPeb(`${deposit}`, "KLAY");
};

// 나의 sft목록
const getMySFTs = async (address) => {
  return await contract.methods.getUserAllSFTs(address).call();
};

// 특정유저의 특정sft 보유수량
const getUserSFTs = async (address, tokenId) => {
  return await contract.methods.getUserSFTs(address, tokenId).call();
};

// 스트리밍금액 차감
const deduction = async (addressList, deductTokenList) => {
  contract.setWallet(keyringContainer);
  return contract.methods
    .deduction(addressList, deductTokenList)
    .send({ from: process.env.SERVER_ADDRESS, gas: 2000000 });
};

// 스트리밍토큰 분배
const distribution = async (tokenIdList, streamingCountList) => {
  contract.setWallet(keyringContainer);
  return contract.methods
    .distribution(tokenIdList, streamingCountList)
    .send({ from: process.env.SERVER_ADDRESS, gas: 2000000 });
};

const toPeb = (el) => {
  return caverExt.utils.toPeb(el);
};

module.exports = {
  addMinter,
  isMinter,
  getUserDeposit,
  getMySFTs,
  getUserSFTs,
  deduction,
  distribution,
  toPeb,
};
