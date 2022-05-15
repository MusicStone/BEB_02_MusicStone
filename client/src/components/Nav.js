import { Link } from "react-router-dom";
import musicstonelogo from "../img/musicstonelogo.png";
import { BsWallet2 } from "react-icons/bs";
import React from "react";
import { useSelector } from "react-redux";

function Nav({ connectWallet }) {
  const state = useSelector((state) => state.accountReducer);
  return (
    <div id="nav">
      <img className="logo" src={musicstonelogo} alt="logo"></img>
      <span id="title">
        <Link to="/" style={{ textDecoration: "none" }}>
          Music Stone
        </Link>
      </span>
      <span id="navmenu">
        <span id="musician">
          <Link to="/musician" style={{ textDecoration: "none" }}>
            Musician
          </Link>
        </span>
        <span id="stones">
          <div className="nav-dropdown">
            <button id="nav-stones-btn">Stones</button>
            <div class="nav-dropdown-content">
              <Link to="/stones/myStone" style={{ textDecoration: "none" }}>
                <div>My Stone</div>
              </Link>
              <Link to="/stones/buyStone" style={{ textDecoration: "none" }}>
                <div>Buy Stone</div>
              </Link>
            </div>
          </div>
        </span>
        <span id="playlist">
          <Link to="/playlist" style={{ textDecoration: "none" }}>
            PlayList
          </Link>
        </span>
        <span>
          {state.isConnect ? (
            <span id="my">
              <Link to="/mypage" style={{ textDecoration: "none" }}>
                MY
              </Link>
            </span>
          ) : (
            <span id="connect">
              <BsWallet2
                className="icon"
                size="22"
                onClick={() => {
                  connectWallet();
                }}
              />
            </span>
          )}
        </span>
      </span>
    </div>
  );
}
export default Nav;
