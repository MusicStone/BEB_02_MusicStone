import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadMyData } from '../../actions';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from "styled-components";
import MyStoneCard from '../../components/Stones/MyStoneCard';
import MyStoneModal from '../../components/Stones/MyStoneModal';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export function MyStone() {
  /*
  stones : 내가 보유한 stone정보
  modalOpen : 판매 modal창 open 여부
  modalStone : 현재 열린 modal창의 stone 정보
  klayPrice : 현재 KLAY의 거래가격(빗썸기준)
  totalPages : 페이지당 8개를 보여주는 기준으로 내 보유 stone들의 페이지 수
  curPage : 현재 선택된 page
  */

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStone, setModalStone] = useState("");
  const [klayPrice, setKlayPrice] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [curPage, setCurPage] = useState(1);

  const server = process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
  const account = useSelector((state) => state.accountReducer);
  const myData = useSelector((state) => state.myStoneReducer);
  const dispatch = useDispatch();


  //모달창 여는 판매버튼
  const handleSellBtn = (stone) => {
    setModalOpen(true);
    setModalStone(stone);
  }

  //내 stone들 페이지에 따라 8개씩 보여주는 함수
  const showMyStones = () => {
    return (myData.stoneList.filter((stone, idx) => (idx >= (curPage - 1) * 8) && idx < (curPage - 1) * 8 + 8)
      .map((stone, idx) => <MyStoneCard key={((curPage - 1) * 8) + idx} stone={stone} handleSellBtn={handleSellBtn} account={account} />))
  }

  //이전 페이지로 이동
  const pageReduce = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  }

  //다음 페이지로 이동
  const pageIncrese = () => {
    if (curPage < totalPages) {
      setCurPage(curPage + 1);
    }
  }

  //해당 페이지로 바로 이동
  const changePage = (page) => {
    setCurPage(page);
  }

  //페이지 하단에 페이지 이동 부분 그려주는 함수
  //현재 페이지수 엄청 늘어나면(ex) 100페이지 막 이렇게) 그대로 다 뿌려줌 나중에 수정 필요
  const drawPageIndex = () => {
    const result = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === curPage) {
        result.push(<span key={i} ><b> {i}</b> </span>);
      } else {
        result.push(<span key={i} onClick={() => changePage(i)}> {i} </span>);
      }
    }
    return result
  }

  //초기 로딩
  useEffect(() => {
    //KLAY 가격 로드
    const apiUrl = `https://api.bithumb.com/public/ticker/KLAY_KRW`
    axios.get(apiUrl)
      .then(price => setKlayPrice(price.data.data.closing_price))

    //MyData 로드
    //일단은 현재 연결된 계정 불러오는 거만 연결해놨고 나중에 페이지에서 account 변경시 새로 로드같은거 추가 필요할듯
    const req = `${server}/stones/mystone/${account.userId}`
    axios.get(req)
      .then((res) => dispatch(loadMyData(res)))
  }, []);

  //data가 load되면 page수 변경
  useEffect(() => {
    setTotalPages(Math.ceil(myData.stoneList.length / 8));
  }, [myData])

  return (
    <Body>
      <StoneContainer>
        <Header>
          <Title><h1>My Stones</h1></Title>
          <RegisterStone>
            {
              myData.isMusician
                ?
                <Link to="/stones/register" style={{ textDecoration: "none" }}>
                  <button> 스톤 등록 </button>
                </Link>
                : null
            }
          </RegisterStone>
        </Header>
        <StonesWrapper>
          {myData.stoneList.length > 0
            ? showMyStones()
            : <div>보유한 스톤이 없습니다.</div>}
        </StonesWrapper>
        <PageSelector>
          {totalPages > 1
            ? <PagingWapper>
              <span onClick={pageReduce}><ChevronLeftIcon /></span>
              {drawPageIndex()}
              <span onClick={pageIncrese}><ChevronRightIcon /></span>
            </PagingWapper>
            : null}
        </PageSelector>
      </StoneContainer>
      <MyStoneModal modalStone={modalStone} modalOpen={modalOpen} setModalOpen={setModalOpen} klayPrice={klayPrice} account={account} />
    </Body>
  );
}

//여기부터 styled
const Body = styled.div`
height: 100%;
margin-top: 1rem;
`;

const StoneContainer = styled.div`
display:flex;
flex-direction: column;
margin: 0 auto;
`;
const Header = styled.div`
width: 980px;
margin: 0 auto 20px;
display:flex;
flex-direction:column;
align-items: center;
`;
const Title = styled.div`
`;
const RegisterStone = styled.div`
width: 100%;
display:flex;
justify-content: right;
padding-right: 130px;
button{
  cursor: pointer;
  padding: 0.5rem 2rem;
  border: 0;
  border-radius: 12px;
  background-color: white;
  color: black;
}
`;
const StonesWrapper = styled.div`
width: 980px;
margin: 0 auto;
display: flex;
flex-wrap: wrap;
justify-content: space-around;
`;

const PageSelector = styled.div`
width: 980px;
margin: 10px auto;
display: flex;
justify-content: center;
`;
const PagingWapper = styled.div`
display: flex;
align-items: center;
span{
  margin: 0 5px;
  cursor: pointer;
}
`;