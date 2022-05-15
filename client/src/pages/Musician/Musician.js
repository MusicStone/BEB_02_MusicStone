import styled from "styled-components";
import MusicianCard from "../../components/Musician/MusicianCard";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { loadMusicianList, resetMusicianList } from "../../actions";

export function Musician() {
  /* state
  loading: 로딩중 true 로딩완료 false
  loadAll: 서버가 응답한 결과값이 20개 미만이면 모두 검색된 것이므로 true면 더이상 요청 안보내게 
  startIdx: 불러오는 Idx의 시작점 20개씩 증가
  keyword: 서버에 요청할 검색어, search시 현재 검색input창에 있는 값으로 갱신
  initial: 초기 로딩인지 확인(로딩시 추가로딩 방지용)
  */
  const [loading, setLoading] = useState(true);
  const [loadAll, setLoadAll] = useState(false);
  const [startIdx, setStartIdx] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [initial, setInitial] = useState(true);
  //scroll체크
  const [ref, inView] = useInView();

  //redux
  const musicianList = useSelector((state) => state.musicianReducer);
  const dispatch = useDispatch();
  const keywordInput = useRef();

  //서버에서 musician 데이터 불러오기
  const loadMusicians = () => {
    const server =
      process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
    const req = `${server}/musician?startIndex=${startIdx}&endIndex=${
      startIdx + 19
    }&keyword=${keyword}`;
    setLoading(true);

    axios.get(req).then((res) => {
      const musicianData = res.data.data;
      dispatch(loadMusicianList(musicianData));
      if (musicianData.length < 20) setLoadAll(true);

      setStartIdx(startIdx + 20);
      setLoading(false);
    });
  };

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  const search = () => {
    setKeyword(keywordInput.current.value);
  };

  useEffect(() => {
    // 보여줄 결과가 남아 있을때 스크롤이 로드할 위치고 로딩 중이 아니면 load
    //startIdx !== 1은 초기 추가로드 방지
    if (inView && !loading && !loadAll && startIdx !== 1) {
      loadMusicians();
    }
  }, [inView, loading]);

  useEffect(() => {
    // 검색조건이 변경되었으므로 list초기화
    dispatch(resetMusicianList());

    //이전 검색값이 있으면 idx초기화 후 거기서 load
    if (startIdx !== 1) {
      setStartIdx(1);
    } else {
      loadMusicians();
      if (initial) {
        setInitial(false);
      }
    }
  }, [keyword]);

  useEffect(() => {
    //이전 검색에서 loadAll이 true였던 경우 초기화도 함께 실행
    if (startIdx === 1 && loadAll) {
      setLoadAll(false);
      loadMusicians();
    } else if (startIdx === 1 && !initial) {
      loadMusicians();
    }
  }, [startIdx]);

  return (
    <Body>
      <Nav>
        <h1>Find your Musician</h1>
        <SearchWrap>
          <SearchInput
            ref={keywordInput}
            type="text"
            placeholder="찾는 뮤지션을 검색해 주세요."
            onKeyPress={handleInputEnter}
          />
          <SearchButton onClick={search}>
            <SearchIcon />
          </SearchButton>
        </SearchWrap>
      </Nav>
      <CardsWrap>
        {musicianList.musicians.map((musician, idx) => {
          return <MusicianCard key={idx + startIdx} musician={musician} />;
        })}
      </CardsWrap>
      <div id="observer" ref={ref}>
        {" "}
      </div>
    </Body>
  );
}

//여기부터 styled
const Body = styled.div`
  box-sizing: border-box;
  height: 100%;
  font-family: Impact, Charcoal, sans-serif;
`;

const Nav = styled.nav`
  margin: 25px auto;
  height: 80px;
  width: 980px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SearchWrap = styled.div`
  position: relative;
  display: flex;
`;

const SearchInput = styled.input`
  width: 300px;
  border: 3px solid #848cb5;
  border-right: none;
  padding: 5px;
  height: 20px;
  border-radius: 10px 0 0 10px;
  outline: none;
  color: #6b6b84;
  &:focus {
    color: #3b3b54;
  }
`;
const SearchButton = styled.button`
  width: 40px;
  height: 36px;
  border: 1px solid #848cb5;
  background: #848cb5;
  text-align: center;
  color: #fff;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  font-size: 20px;
`;

const CardsWrap = styled.section`
  width: 980px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;
