import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const BuyStoneCard = ({ stone }) => {
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

  return (
    <Link
      to={`/stones/tradeStone/${stone.stoneId}`}
      style={{ textDecoration: "none" }}
    >
      <CardContainer>
        <Img src={`${server}/${stone.img}`} />
        <Name>{stone.name}</Name>
        <Musician>{stone.musician_name}</Musician>
        <TradeBox>
          <Balance>
            {stone.myBalance ? `보유 : ${stone.myBalance}` : " "}
          </Balance>
          <Price>{stone.price} KLAY</Price>
          {/*가격변동폭 시간상 보류
                    <PriceDif color={stone.priceDif > 0 ? "#e81a46" : "#00a1ff"}>
                        {stone.priceDif > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        {stone.priceDif} %
                    </PriceDif>
                    */}
        </TradeBox>
      </CardContainer>
    </Link>
  );
};

export default BuyStoneCard;

const CardContainer = styled.div`
  margin: 20px;
  width: 200px;
  height: 300px;
  cursor: pointer;
  font-family: "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
`;
const Img = styled.img`
  width: 200px;
  height: 200px;
  -webkit-user-drag: none;
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
  }
`;
const Name = styled.h5`
  margin: 0 auto;
  text-align: center;
`;
const Musician = styled.h4`
  margin: 0 auto;
  text-align: center;
`;
const TradeBox = styled.div`
  display: flex;
  span {
    width: 100%;
    text-align: center;
  }
`;
const Balance = styled.span`
  color: #777777;
  display: flex;
  justify-content: center;
  white-space: pre;
`;
const Price = styled.span``;
