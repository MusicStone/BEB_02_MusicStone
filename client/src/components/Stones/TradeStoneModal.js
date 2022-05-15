import React, { forwardRef, useImperativeHandle, useState } from "react"
import styled from "styled-components";
import Caver from "caver-js";
import service_abi from '../../abi/Service';
import axios from 'axios';



const TradeStoneModal = forwardRef(({ klayPrice, stoneData, modalOpen, modalTrade, setModalOpen, account, showName, id }, ref) => {
    const [quantity, setQuantity] = useState(0);
    const caver = new Caver(window.klaytn);
    const server = process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

    const handleClose = () => {
        setModalOpen(false);
    }
    const handleInput = (e) => {

        if (Number(e.target.value) > modalTrade.amount) {
            alert(`현재 남은 판매수량은 ${modalTrade.amount}개 입니다.`);
        } else {
            setQuantity(e.target.value)
        }
    }

    //현재 서버에서 리스트 받아오는게 아직이라 하드코딩값 구매됨
    const handleBuy = async () => {
        const service = new caver.klay.Contract(service_abi, process.env.REACT_APP_SERVICE_ADDRESS);

        if (account.isConnect) {
            const tx = await service.methods
                //여기 요청보낼때 서버에서 온 item_id랑 id중에 어떤걸로 보내야하는지 헷갈림
                .purchaseItem(modalTrade.item_id, quantity)
                .send({
                    from: account.account,
                    //value = amount * unitPrice
                    value: caver.utils.toPeb((quantity * modalTrade.price).toString()),
                    gas: 1000000,
                })
                .then(() => {
                    const req = `${server}/stones/tradestone/${id}`
                    axios.post(req, {
                        quantity,
                        tradeId: modalTrade.id
                    })
                        .then((res) => {
                            alert('구매가 완료되었습니다.')
                            console.log(res)
                        })
                })
        } else {
            alert("지갑을 연결해주세요.");
        }
    }

    useImperativeHandle(ref, () => ({
        resetQuantity: () => {
            setQuantity(0);
        }
    }));

    return (
        <ModalOverlay display={modalOpen ? "flex" : "none"}  >
            <ModalWindow>
                <Head>
                    <Close onClick={() => handleClose()}>
                        <span>X</span>
                    </Close>
                </Head>
                <Content>
                    <Nav>
                        <Item>음원</Item>
                        <PriceQuantity>수량</PriceQuantity>
                        <PriceQuantity>가격</PriceQuantity>
                    </Nav>
                    <Cart>
                        <Receipt>
                            <Item>{stoneData.stoneDetail.name} - {stoneData.musician ? showName() : ''}</Item>
                            <InputWrapper>
                                <ReceiptInput type="number" min="0" value={quantity} onChange={(e) => handleInput(e)} />
                            </InputWrapper>
                            <PriceQuantity>{modalTrade.price} KLAY</PriceQuantity>
                        </Receipt>
                        <Total>
                            <div><h3>Total</h3></div>
                            <TotalPrice>
                                <div>{(modalTrade.price * quantity).toFixed(3)} KLAY</div>
                                <div>{(klayPrice * modalTrade.price * quantity).toFixed(0)} 원</div>
                            </TotalPrice>
                        </Total>
                    </Cart>
                    <BtnBox>
                        <BuyBtn onClick={handleBuy}>구매</BuyBtn>
                    </BtnBox>
                </Content>
            </ModalWindow>
        </ModalOverlay >
    )
});

export default TradeStoneModal;

const ModalOverlay = styled.div`
width: 100%;
height: 100%;
position: absolute;
left: 0;
top: 0;
display:${({ display }) => display};;
flex-direction: column;
align-items: center;
justify-content: center;
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
backdrop-filter: blur(1.5px);
`;
const ModalWindow = styled.div`
background: #333333;
box-shadow: 0 8px 32px 0 #222222;
backdrop-filter: blur( 13.5px );
-webkit-backdrop-filter: blur( 13.5px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );

width: 450px;
height: 300px;
position: relative;
top: -100px;
padding: 10px;
`;
const Head = styled.div`
width: 100%;
height: 20px;
display:flex;
flex-direction:column;

`;
const Close = styled.div`
span{
    cursor: pointer;
    display: inline;
    float: right;
    padding-right: 10px;
    text-shadow: 1px 1px 2px gray;
}   
`;
const Content = styled.div`
width: 100%;
height: 280px;
display:flex;
flex-direction: column;
`;
const Nav = styled.div`
height: 50px;
border-bottom: 0.5px solid #808080;
display:flex;
span{
    margin: 0 5px;
    text-align:center;
    line-height: 50px;
}
`;
const Item = styled.span`
width:240px;
`;
const PriceQuantity = styled.span`
width: 90px;
`;
const Cart = styled.div`
height: 150px;
border-bottom: 0.5px solid #808080;
display:flex;
flex-direction: column;
div{
    height:75px;
}
`;
const Receipt = styled.div`
display:flex;
span{
    margin: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    line-height: 75px;
}
`;
const InputWrapper = styled.span`
width: 90px;
margin: 0 5px;
display:flex;
align-items: center;
`;
const ReceiptInput = styled.input`
width: 80%;
height: 25px;
margin: 0 10px;
padding: 0 5px;
text-align:right;
`;
const Total = styled.div`
display:flex;
div{
    width:100%;
}
h3{
    padding: 0 20px;
}
`;
const TotalPrice = styled.div`
display:flex;
flex-direction:column;
div{
    padding-left: 50px;
}
`;
const BtnBox = styled.div`
width: 100%;
height: 80px;
display:flex;
justify-content:center;
align-items: center;
`
const BuyBtn = styled.button`
width: 200px;
height: 50px;
cursor:pointer;
border-radius: 10px;
`;