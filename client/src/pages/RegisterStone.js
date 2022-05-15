import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Caver from "caver-js";
import service_abi from "../abi/Service";

export default function RegisterStone() {
  const [stoneName, setStoneName] = useState("");
  const state = useSelector((state) => state.accountReducer);
  const account = state.account;
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [stonefile, setStonefile] = useState(null);
  const [lyricist, setLyricist] = useState("");
  const [composer, setComposer] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [category, setCategory] = useState("default");
  const [album, setAlbum] = useState("");
  const [albumList, setAlbumList] = useState([]);
  const [SFTAmount, setSFTAmount] = useState(0);
  const caver = new Caver(window.klaytn);
  const [tokenId, setTokenId] = useState("");
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
  let albumlist;

  useEffect(() => {
    async function req() {
      await axios
        .get(`${server}/stones/${account}`)
        .then((res) => {
          albumlist = res.data.data.albumList;
          console.log(albumlist);
          setAlbumList(albumlist);
        })
        .catch((e) => console.log(e));
    }
    req();
  }, []);
  const onChangeStoneName = (e) => {
    setStoneName(e.target.value);
  };
  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const onChangeStoneFile = (e) => {
    setStonefile(e.target.files[0]);
  };
  const onChangeLyricist = (e) => {
    setLyricist(e.target.value);
  };
  const onChangeComposer = (e) => {
    setComposer(e.target.value);
  };
  const onChangeLyrics = (e) => {
    setLyrics(e.target.value);
  };
  const onChangeSFTAmount = (e) => {
    setSFTAmount(Number(e.target.value));
  };
  const mintSFT = async () => {
    const service = new caver.klay.Contract(
      service_abi,
      process.env.REACT_APP_SERVICE_ADDRESS
    );
    if (
      album &&
      stoneName &&
      account &&
      description &&
      stonefile &&
      lyricist &&
      composer &&
      lyrics &&
      SFTAmount
    ) {
      const tx = await service.methods
        .mintSFT(SFTAmount)
        .send({
          from: state.account,
          gas: 1000000,
        })
        .then((data) =>
          setTokenId(data.events.SFTMinted[0].returnValues.token_id)
        );
    } else if (album === "") {
      alert("앨범을 선택해주세요. 원하는 앨범이 없다면 앨범을 등록해주세요.");
    } else if (!stoneName) {
      alert("이름을 입력해주세요.");
    } else if (!account) {
      alert("지갑을 연결해주세요.");
    } else if (!description) {
      alert("소개글을 입력해주세요.");
    } else if (!stonefile) {
      alert("음원파일을 선택해주세요.");
    } else if (!lyricist) {
      alert("작사가를 입력해주세요.");
    } else if (!composer) {
      alert("작곡가를 입력해주세요.");
    } else if (!lyrics) {
      alert("가사를 입력해주세요.");
    } else if (!SFTAmount) {
      alert("민팅할 SFT 개수를 입력해주세요.");
    }
  };
  const saveStone = async () => {
    const formData = new FormData();
    formData.append("albumId", album);
    formData.append("stoneName", stoneName);
    formData.append("description", description);
    formData.append("stonefile", stonefile);
    formData.append("lyricist", lyricist);
    formData.append("composer", composer);
    formData.append("lyrics", lyrics);
    formData.append("category", category);
    formData.append("totalBalance", SFTAmount);
    formData.append("tokenId", tokenId);
    await axios
      .post(`${server}/stones/register/${account}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.message);
        navigate("/stones/myStone");
      });
  };
  useEffect(() => {
    if (tokenId) {
      saveStone();
    }
  }, [tokenId]);
  return (
    <div>
      <div id="stoneregisterpage">
        <div>
          <span className="pagetitle">스톤 등록</span>
          <span>
            <Link to="/album/register" style={{ textDecoration: "none" }}>
              <button className="albumbtn"> 앨범 등록 </button>
            </Link>
          </span>
        </div>
        {state.isConnect ? (
          <div>
            <div className="text">지금 연결된 계정 주소 :</div>
            <div>{state.account}</div>
          </div>
        ) : (
          <div className="text">계정을 먼저 연결하세요.</div>
        )}
        <div>
          <select
            className="Aselectbox"
            onChange={(e) => {
              const selectedAlbum = e.target.value;
              setAlbum(selectedAlbum);
            }}
          >
            <option value="">앨범을 선택해주세요.</option>
            {albumList.map((e) => {
              return (
                <option e={e} value={e.id}>
                  {e.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <div>mp3 파일만 첨부 가능합니다.</div>
          <input
            className="fileinput"
            type="file"
            onChange={(e) => onChangeStoneFile(e)}
            name="stonefile"
            accept=".mp3"
          />
        </div>
        <div>
          <div className="registertext">name</div>
          <input
            className="stonenameinput"
            type="text"
            placeholder="스톤 이름을 입력해주세요."
            onChange={onChangeStoneName}
          ></input>
        </div>
        <div>
          <div className="registertext">lyricist</div>
          <input
            className="stonenameinput"
            type="text"
            placeholder="스톤 작사가를 입력해주세요."
            onChange={onChangeLyricist}
          ></input>
        </div>
        <div>
          <div className="registertext">composer</div>
          <input
            className="stonenameinput"
            type="text"
            placeholder="스톤 작곡가를 입력해주세요."
            onChange={onChangeComposer}
          ></input>
        </div>
        <div>
          <div className="registertext">info</div>
          <textarea
            className="stoneinfoinput"
            type="text"
            placeholder="스톤의 소개글을 입력해주세요."
            onChange={onChangeDescription}
          ></textarea>
          <div>
            <div className="registertext">lyrics</div>
            <textarea
              className="lyricsinput"
              type="text"
              placeholder="스톤의 가사를 입력해주세요."
              onChange={onChangeLyrics}
            ></textarea>
          </div>
          <div>
            <div className="registertext">Category</div>
            <div className="selectbox">
              <select
                className="selectbox"
                onChange={(e) => {
                  const selectedCategory = e.target.value;
                  setCategory(selectedCategory);
                }}
              >
                <option key="default" value="default">
                  스톤의 카테고리를 선택해주세요.
                </option>
                <option key="Ballade" value="Ballade">
                  Ballade
                </option>
                <option key="Dance" value="Dance">
                  Dance
                </option>
                <option key="RnB" value="RnB">
                  R&B
                </option>
                <option key="Hiphop" value="Hiphop">
                  Hiphop
                </option>
                <option key="Indie" value="Indie">
                  Indie
                </option>
                <option key="Rock" value="Rock">
                  Rock
                </option>
                <option key="Trot" value="Trot">
                  Trot
                </option>
                <option key="Classic" value="Classic">
                  Classic
                </option>
                <option key="Jazz" value="Jazz">
                  Jazz
                </option>
              </select>
            </div>
          </div>
          <div className="registertext">SFT Minting</div>
          <input
            className="stonenameinput"
            placeholder="민팅할 SFT 개수를 입력해주세요."
            onChange={onChangeSFTAmount}
          ></input>
          <div>
            <button className="editbtn" onClick={mintSFT}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
