import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import Caver from "caver-js";
import service_abi from '../../abi/Service';


const MyStoneCard = ({ stone, handleSellBtn, account }) => {
    const server = process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
    const caver = new Caver(window.klaytn);
    const service = new caver.klay.Contract(service_abi, process.env.REACT_APP_SERVICE_ADDRESS);
    const [balance, setBalance] = useState(0);
    const [canSellBalance, setCanSellBalance] = useState(0);

    const showName = () => {
        const kName = stone.stoneInfo.musicianInfo[0].name_korea;
        const eName = stone.stoneInfo.musicianInfo[0].name_english;

        if (kName && eName) {
            return `${kName}(${eName})`;
        } else if (kName) {
            return kName;
        } else {
            return eName;
        }
    }

    useEffect(() => {
        if (balance) {
            const tx = service.methods
                .getUserCanSellBalances(account.account, stone.stoneInfo.token_id)
                .call()
                .then((res) => {
                    setCanSellBalance(res)
                })
        }
    }, [balance])

    useEffect(() => {
        const tx = service.methods
            .getUserSFTs(account.account, stone.stoneInfo.token_id)
            .call()
            .then((res) => {
                setBalance(res)
            })
    }, [])

    return (
        <CardContainer>
            <Balance>
                <div>
                    <span>{`총 발행 : ${stone.stoneInfo.total_balance}`}</span>
                </div>
                <div>
                    <span>{`보유 : ${balance}`}</span>
                    <span>{`판매 가능:${canSellBalance}`}</span>
                </div>

            </Balance>
            <Link to={`/stones/tradeStone/${stone.stoneInfo.id}`} style={{ textDecoration: "none" }} cursor="pointer">
                <Img src={`${server}/${stone.img}`} />
                <Name>{stone.stoneInfo.name}</Name>
                <Musician>{showName()}</Musician>
            </Link>
            <TradeBox>
                <TradeBtn onClick={() => handleSellBtn(stone)}>판매</TradeBtn>
            </TradeBox>
        </CardContainer >

    );
}

export default MyStoneCard;

const CardContainer = styled.div`
    margin: 10px;
    width: 200px;
    height: 300px;
    font-family: "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    `;
const Img = styled.img`
width: 200px;
height: 200px;
-webkit-user-drag: none;
transition:all .2s ease-in-out;
-webkit-transition:all .2s ease-in-out;
-moz-transition:all .2s ease-in-out;
-ms-transition:all .2s ease-in-out;
-o-transition:all .2s ease-in-out;
&:hover
{
transform:scale(1.1);
-webkit-transform:scale(1.1);
-moz-transform:scale(1.1);
-ms-transform:scale(1.1);
-o-transform:scale(1.1)
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
height: 50px;
display:flex;
flex-direction: column;
`;
const Balance = styled.span`
font-size: 0.7rem;
display:flex;
flex-direction:column;
div{
    display:flex;
    justify-content:space-betwen;
}
span{
    padding: 0 10px;
}
`;
const TradeBtn = styled.button`
width: 100px;
margin: 0 auto;
cursor: pointer;
`;