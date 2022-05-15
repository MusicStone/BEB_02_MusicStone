import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Album, Mypage, PlayList, RegisterMusician } from "./pages";
import BuyToken from "./pages/BuyToken";
import { Musician, MusicianInfo } from "./pages/Musician";
import { MyStone, BuyStone, TradeStone } from "./pages/Stones";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { RegisterAlbum } from "./pages/RegisterAlbum";
import RegisterStone from "./pages/RegisterStone";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.accountReducer);
  const [userId, setUserId] = useState("");
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

  const getUserId = async (account) => {
    alert(account);
    await axios
      .get(`${server}/user/${account}`)
      .then((res) => {
        dispatch({ type: "GET_USERID", userId: res.data.userId });
        setUserId(res.data.userId);
      })
      .catch((e) => alert(e));
  };
  const kaikasLogin = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
    }
    try {
      const wallet = await window.klaytn.enable();
      dispatch({ type: "ON_CONNECT", account: wallet });
      getUserId(wallet);
    } catch (ex) {
      console.log(ex);
    }
  };
  const connectWallet = () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      kaikasLogin();
    } else {
      console.log("connectwallet else");
    }
  };
  return (
    <div>
      <Router>
        <Nav connectWallet={connectWallet} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/musician" element={<Musician />} />
          <Route path="/musician/:id" element={<MusicianInfo />} />
          <Route path="/musician/register" element={<RegisterMusician />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/album/register" element={<RegisterAlbum />} />
          <Route path="/stones/myStone" element={<MyStone />} />
          <Route path="/stones/register" element={<RegisterStone />} />
          <Route path="/stones/buyStone" element={<BuyStone />} />
          <Route path="/stones/tradeStone/:id" element={<TradeStone />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/buyToken" element={<BuyToken />} />
          <Route path="/playlist" element={<PlayList />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
