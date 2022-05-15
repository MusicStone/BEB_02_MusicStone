import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import SellStone from "../../components/Stones/SellStone";
import TradeStoneModal from "../../components/Stones/TradeStoneModal";
import PreviewStream from "../../components/PreviewStream";

export function TradeStone() {
  const modalRef = useRef();

  const { id } = useParams();
  const [klayPrice, setKlayPrice] = useState(0);
  const [stoneData, setStoneData] = useState({
    stoneDetail: null,
    musician: null,
    sellList: [],
    minPrice: null,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrade, setModalTrade] = useState("");
  const account = useSelector((state) => state.accountReducer);
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

  const showName = () => {
    const kName = stoneData.musician.name_korea;
    const eName = stoneData.musician.name_english;

    if (kName && eName) {
      return `${kName}(${eName})`;
    } else if (kName) {
      return kName;
    } else {
      return eName;
    }
  };

  const showDesc = () => {
    const desc = stoneData.stoneDetail.description.split("\n");
    return (
      <Desc>
        {desc.map((line) => {
          line = line === "\r" ? " " : line;
          return <div>{line}</div>;
        })}
      </Desc>
    );
  };

  const showSellList = () => {
    return stoneData.sellList.map((trade) => {
      return (
        <SellStone
          trade={trade}
          klayPrice={klayPrice}
          handleBuyBtn={handleBuyBtn}
        />
      );
    });
  };
  /* 가격 변동은 추후에 하기로 함
const showPriceDif = () => {
  const priceDif = (StoneData.minPrice - StoneData.prevPrice).toFixed(2);
  const difPercent = (
    (StoneData.minPrice / StoneData.prevPrice - 1) *
    100
  ).toFixed(2);
  return (
    <PriceDif color={priceDif > 0 ? "#e81a46" : "#00a1ff"}>
      {priceDif > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      {`${priceDif} (${difPercent}%)`}
    </PriceDif>
  );
};*/

  const addPlayList = () => {
    if (account.isConnect) {
      const req = `${server}/playlist/${account.userId}`;
      axios
        .post(req, {
          stoneId: stoneData.stoneDetail.id,
        })
        .then((res) => {
          if (res.status === 201) {
            alert("플레이리스트에 추가되었습니다.");
          } else if (res.status === 200) {
            alert("이미 추가된 곡입니다.");
          } else {
            alert("네트워크 통신 오류");
          }
        });
    } else {
      alert("지갑을 연결해주세요.");
    }
  };

  const handleBuyBtn = (trade) => {
    modalRef.current.resetQuantity();
    setModalTrade(trade);
    setModalOpen(true);
  };

  useEffect(() => {
    //KLAY 가격 로드
    const apiUrl = `https://api.bithumb.com/public/ticker/KLAY_KRW`;
    axios
      .get(apiUrl)
      .then((price) => setKlayPrice(price.data.data.closing_price));

    const req = `${server}/stones/tradestone/${id}`;
    axios.get(req).then((res) => setStoneData(res.data));
  }, []);

  return stoneData.stoneDetail ? (
    <Body>
      <StoneContainer>
        <PreviewStream
          img={stoneData.albumImg}
          stoneId={stoneData.stoneDetail.id}
        />
        <StoneBox>
          <StoneWrapper>
            <Title>
              <span>
                {stoneData.stoneDetail.name} -{" "}
                {stoneData.musician ? showName() : "unknown"}
              </span>
              <AddPlaylistBtn onClick={addPlayList}>+Playlist</AddPlaylistBtn>
            </Title>
            <Info>
              <Price>
                <div>최저가 : {stoneData.minPrice} KLAY</div>
                {/*<div>전일비 : {showPriceDif()}</div>*/}
              </Price>
              <Lyricist>작사가 : {stoneData.stoneDetail.lyricist}</Lyricist>
              <Composer>작곡가 : {stoneData.stoneDetail.composer}</Composer>
              {showDesc()}
            </Info>
          </StoneWrapper>
        </StoneBox>
      </StoneContainer>
      <TradeContainer>
        <SellListWrapper>
          <SellNav>
            <span>가격(Klay)</span>
            <span>가격(원)</span>
            <span>수량</span>
            <span>판매자</span>
            <span>구매</span>
          </SellNav>
          <SellList>{showSellList()}</SellList>
        </SellListWrapper>
        <NotifyWrapper>{showRules()}</NotifyWrapper>
      </TradeContainer>
      <TradeStoneModal
        ref={modalRef}
        klayPrice={klayPrice}
        stoneData={stoneData}
        modalOpen={modalOpen}
        modalTrade={modalTrade}
        setModalOpen={setModalOpen}
        account={account}
        showName={showName}
      />
    </Body>
  ) : null;
}

const showRules = () => {
  return (
    <RulesWrapper>
      <h3> 유의사항</h3>
      <div>
        거래 수수료는 구매 및 판매금액의 1 주당 1.2%(상한 1 주당 300캐쉬 /
        소수점 이하 절사) 입니다.
      </div>
      <div>
        ※ 단, 5 주 이상 구매 주문 시, 거래 수수료가 1.0% (상한 1주당 250캐쉬 /
        소수점 이하 절사)로 감면됩니다.
      </div>
      <div>
        구매 주문 시, 구매하신 가격 대비 과거 1년 수익률을 반드시 확인 바랍니다.
      </div>
      <div>
        구매체결 시 수수료를 포함한 결제 금액이 '내 지갑'에서 자동으로
        결제됩니다.
      </div>
      <div>판매체결 시 수수료를 제외한 판매 금액이 '내 지갑'에 합산됩니다.</div>
      <div>
        구매주문금액 전체가 대기금으로 설정되며, 주문취소 시 해제됩니다.
      </div>
      <div>
        과거 저작권료 수익률은 구매가 대비 과거 1년 저작권료입니다. 1년 미만의
        자료만 존재할 경우, 연으로 환산됩니다.
      </div>
      <div>
        거래단위 당 판매 차익이 5만원 이하일 경우, 원천징수세액이
        없습니다(분리과세). 상세내용은'자주 묻는 질문' 참고바랍니다
      </div>
      <div>
        구매결정은 온전히 회원의 판단으로 이뤄졌으며, 뮤직스톤은 어떠한 경우에도
        미래의 저작권료 및 저작권료 참여청구권의 판매 성사여부를 보장하거나
        책임지지 않습니다.
      </div>
    </RulesWrapper>
  );
};

const Body = styled.div`
  box-sizing: border-box;
  height: 100%;
  font-family: Impact, Charcoal, sans-serif;
`;
const StoneContainer = styled.div`
  width: 1100px;
  height: 400px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  border-bottom: 2px solid #303030;
`;
const TradeContainer = styled.div`
width : 1100px;
height: 350px;
margin: 0 auto;
display flex;
`;
const StoneBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StoneWrapper = styled.div`
  position: absolute;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 2px;
    background-color: #0f0f0f;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #333333;
  }
`;
const Title = styled.h2`
  margin: 10px auto;
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
`;
const AddPlaylistBtn = styled.button`
  height: 25px;
  cursor: pointer;
  border-radius: 6px;
  border: 0;
  background-color: #666666;
  color: white;
  &:hover {
    color: black;
  }
`;
const Info = styled.div``;
const Price = styled.div`
  div {
    font-weight: 500;
    display: flex;
  }
`;
const Composer = styled.div``;
const Lyricist = styled.div``;
const Desc = styled.div`
  margin-top: 20px;
`;
const SellListWrapper = styled.div`
  width: 55%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const SellNav = styled.div`
  margin: 15px 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    text-align: center;
    width: 100%;
  }
`;
const SellList = styled.li`
  margin: 10px;
  list-style: none;
  overflow: auto;
  li {
    margin: 5px 20px;
  }
`;
const NotifyWrapper = styled.div`
  width: 45%;
`;
const RulesWrapper = styled.div`
  h3 {
    text-align: center;
  }
  div {
    margin: 2px auto;
    font-size: 0.8rem;
  }
`;
