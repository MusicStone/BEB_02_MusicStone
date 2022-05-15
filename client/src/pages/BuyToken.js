import { useSelector } from "react-redux";
import Caver from "caver-js";
import React, { useState } from "react";
import axios from "axios";
import service_abi from "../abi/Service";
import token_abi from "../abi/Token";

function BuyToken() {
  const swapRatio = 500.0; // 클레이 : 뮤직스톤 토큰 교환비율
  const state = useSelector((state) => state.accountReducer);
  const [klayBalance, setKlayBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [keepingTokenBal, setKeepingTokenBal] = useState(0);
  const [rewardTokenBal, setRewardTokenBal] = useState(0);
  const [keepToken, setKeepToken] = useState(0);
  const [rewardToken, setRewardToken] = useState(0);
  const [depositToken, setDepositToken] = useState(0);
  const [swapAmount, setSwapAmount] = useState({ klay: 0.0, musictStone: 0.0 });
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
  const { klay, token } = swapAmount;
  // caver-js 연결
  const caver = new Caver(window.klaytn);
  var tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;
  var serviceAddress = process.env.REACT_APP_SERVICE_ADDRESS;
  var accessKeyId = process.env.REACT_APP_ACCESS_KEY_ID; //KAS 콘솔 - Security - Credential에서 발급받은 accessKeyId 인증아이디
  var secretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY; //KAS 콘솔 - Security - Credential에서 발급받은 secretAccessKey 인증비밀번호
  const CaverExtKAS = require("caver-js-ext-kas");
  const caverExt = new CaverExtKAS();
  const chainId = 1001; // 클레이튼 테스트 네트워크 접속 ID
  caverExt.initKASAPI(chainId, accessKeyId, secretAccessKey); //KAS console 초기화

  // 토큰 교환을 위한 토큰 수량 입력 이벤트(Klay & Token)
  const onChangeValue = (e) => {
    const { value, name } = e.target;
    //klay로 입력되면 Token 입력창에 토큰 교환비율에 따라 값을 계산해서 넣어준다.
    if (name === "klay") {
      setSwapAmount(() => ({
        klay: Number.parseFloat(value),
        token: Number.parseFloat(value) * swapRatio,
      }));
      //뮤직스톤 Token으로 입력되면 klay입력창에 토큰 교환비율에 따라 값을 계산해서 넣어준다.
    } else if (name === "token") {
      setSwapAmount(() => ({
        token: Number.parseFloat(value),
        klay: Number.parseFloat(value) / swapRatio,
      }));
    }
  };
  const onChangeRewardToken = (e) => {
    setRewardToken(e.target.value);
  };
  const onChangeKeepToken = (e) => {
    setKeepToken(e.target.value);
  };
  const onChangeDepositToken = (e) => {
    setDepositToken(e.target.value);
  };
  const GetKlayBalance = async () => {
    if (state.isConnect) {
      // caver 함수 중 현재 공개키의 klay양을 리턴하는 함수
      let bal = await caverExt.klay.getBalance(state.account);
      bal = caverExt.utils.fromPeb(bal, "KLAY");
      setKlayBalance(bal);
      console.log("balance : " + bal);
    } else {
      alert("지갑을 먼저 연결해주세요.");
    }
  };
  //뮤직스톤 토큰 잔액 조회
  var GetTokenBalance = async () => {
    if (state.isConnect) {
      const kip7 = new caverExt.kct.kip7(tokenAddress); //생성된 토큰의 Address 입력
      const receipt = await kip7.balanceOf(state.account); //balanceOf('토큰 조회할 주소')

      console.log(receipt);
      setTokenBalance(caverExt.utils.fromPeb(receipt, "KLAY"));
    } else {
      alert("지갑을 먼저 연결해주세요.");
    }
  };
  const swapKlay2Token = async () => {
    if (
      !state.isConnect ||
      swapAmount.klay === 0.0 ||
      swapAmount.token === 0.0
    ) {
      alert("지갑을 연결하거나 교환할 클레이/토큰 수량을 입력해주세요.");
      return;
    }
    const klayAmount = String(swapAmount.klay);
    var myContract2 = new caver.klay.Contract(service_abi, serviceAddress);
    const tx = await myContract2.methods
      .buyToken()
      .send({
        type: "SMART_CONTRACT_EXECUTION",
        from: state.account,
        value: caver.utils.toPeb(klayAmount, "KLAY"),
        gas: 1000000,
      })
      .then((data) => {
        console.log(data);
        GetBalance();
      })
      .catch((err) => {
        console.log(err);
      });
    GetBalance();
  };
  //지갑 잔액 확인
  const GetBalance = () => {
    console.log("state.isConnect:" + state.isConnect);
    if (state.isConnect) {
      GetKlayBalance();
      GetTokenBalance();
      GetKeepingTokenBal();
      GetRewardTokenBal();
    } else {
      alert("지갑을 먼저 연결해주세요.");
    }
  };
  const GetKeepingTokenBal = async () => {
    var service_contract = new caver.klay.Contract(service_abi, serviceAddress);
    await service_contract.methods
      .getUserDeposit(state.account)
      .call()
      .then((data) => {
        console.log(caver.utils.fromPeb(data));
        setKeepingTokenBal(caver.utils.fromPeb(data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const GetRewardTokenBal = async () => {
    var service_contract = new caver.klay.Contract(service_abi, serviceAddress);
    await service_contract.methods
      .getUserDistribution(state.account)
      .call()
      .then((data) => {
        console.log(data);
        setRewardTokenBal(caver.utils.fromPeb(data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const saveDeposit = async () => {
    await axios.post(`${server}/user/deposit/${state.account}`).then((res) => {
      if (res.data.message === "Ok") {
        alert("예치가 완료되었습니다.");
      } else {
        alert("오류, 저장에 실패했습니다.");
      }
    });
  };
  const saveGetDeposit = async () => {
    await axios.post(`${server}/user/deposit/${state.account}`).then((res) => {
      if (res.data.message === "Ok") {
        alert("출금이 완료되었습니다.");
      } else {
        alert("오류, 저장에 실패했습니다.");
      }
    });
  };
  const keepingToken = async () => {
    var service_contract = new caver.klay.Contract(service_abi, serviceAddress);
    var token_contract = new caver.klay.Contract(token_abi, tokenAddress);
    let isSend;

    await token_contract.methods
      .approve(serviceAddress, caver.utils.toPeb(keepToken))
      .send({
        type: "SMART_CONTRACT_EXECUTION",
        from: state.account,
        gas: 1000000,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    await service_contract.methods
      .depositMSToken(caver.utils.toPeb(keepToken))
      .send({
        type: "SMART_CONTRACT_EXECUTION",
        from: state.account,
        gas: 1000000,
      })
      .then((data) => {
        console.log(data);
        isSend = data.status;
      })
      .catch((err) => {
        console.log(err);
      });

    if (!isSend) {
      alert("오류로 인해 전송이 실패했습니다.");
    } else {
      saveDeposit();
      GetBalance();
    }
  };
  const getRewardToken = async () => {
    var service_contract = new caver.klay.Contract(service_abi, serviceAddress);
    let isSend = true;
    await service_contract.methods
      .withdrawalDistribution(caver.utils.toPeb(rewardToken))
      .send({
        type: "SMART_CONTRACT_EXECUTION",
        from: state.account,
        gas: 1000000,
      })
      .then((data) => {
        console.log(data);
        isSend = data.status;
      })
      .catch((err) => {
        console.log(err);
      });

    if (isSend === false) {
      alert("오류로 인해 전송이 실패했습니다.");
    } else {
      alert("전송 성공, 잔액을 확인해주세요.");
      GetBalance();
    }
  };
  const getDepositToken = async () => {
    var service_contract = new caver.klay.Contract(service_abi, serviceAddress);
    let isSend = true;
    await service_contract.methods
      .withdrawalDeposit(caver.utils.toPeb(depositToken))
      .send({
        type: "SMART_CONTRACT_EXECUTION",
        from: state.account,
        gas: 1000000,
      })
      .then((data) => {
        console.log(data);
        isSend = data.status;
      })
      .catch((err) => {
        console.log(err);
      });

    if (isSend === false) {
      alert("오류로 인해 전송이 실패했습니다.");
    } else {
      saveGetDeposit();
      GetBalance();
    }
  };
  return (
    <div id="buytokenpage">
      <div className="pagetitle">토큰 구매</div>
      <div className="tokentext">
        <span className="text">
          아래 지갑 주소가 구매할 지갑주소인지 반드시 확인하세요.
        </span>
      </div>
      <div>
        <span className="text">지갑 주소 : {state.account}</span>
      </div>

      <div className="tokentext">
        <span>
          <button onClick={GetBalance}>지갑 잔액 확인</button>
        </span>
      </div>
      <div className="tokentext">
        <span className="text">클레이 잔액 : {klayBalance} klays</span>
        <span className="text">뮤직스톤 토큰 잔액 : {tokenBalance} tokens</span>
      </div>
      <div className="tokentext">
        <span className="text">
          예치된 토큰 잔액 : {keepingTokenBal} tokens
        </span>
        <span className="text">
          보상으로 받을 수 있는 토큰 잔액 : {rewardTokenBal} tokens
        </span>
      </div>
      <input
        id="klayInput"
        className="tokeninput"
        type="number"
        name="klay"
        placeholder="클레이를 입력하세요."
        value={klay}
        onChange={onChangeValue}
      ></input>
      <input
        id="tokenInput"
        className="tokeninput"
        placeholder="토큰 개수를 입력하세요."
        type="number"
        name="token"
        value={token}
        onChange={onChangeValue}
      ></input>
      <button className="buytokenbtn" onClick={swapKlay2Token}>
        교환
      </button>
      <div>
        <input
          className="tokeninput"
          placeholder="예치할 토큰 개수를 입력하세요."
          type="number"
          onChange={onChangeKeepToken}
        ></input>
        <button className="buytokenbtn" onClick={keepingToken}>
          토큰 예치
        </button>
      </div>
      <div>
        <input
          className="tokeninput"
          placeholder="인출할 보상 토큰 개수를 입력하세요."
          type="number"
          onChange={onChangeRewardToken}
        ></input>
        <button className="buytokenbtn" onClick={getRewardToken}>
          보상 토큰 인출
        </button>
      </div>
      <div>
        <input
          className="tokeninput"
          placeholder="인출할 예치 토큰 개수를 입력하세요."
          type="number"
          onChange={onChangeDepositToken}
        ></input>
        <button className="buytokenbtn" onClick={getDepositToken}>
          예치 토큰 인출
        </button>
      </div>
    </div>
  );
}
export default BuyToken;
