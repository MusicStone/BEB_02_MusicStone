import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SNSList from "../components/SNSList";
import { useNavigate } from "react-router-dom";

export function RegisterMusician() {
  const [KName, setKName] = useState("");
  const [EName, setEName] = useState("");
  const state = useSelector((state) => state.accountReducer);
  const account = state.account;
  const userId = state.userId;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [img, setImg] = useState(null);
  const [imgsrc, setImgsrc] = useState(null);
  const [description, setDescription] = useState("");
  const [snsList, setSnsList] = useState([]);
  const [count, setCount] = useState(0);
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

  const onChangeKName = (e) => {
    setKName(e.target.value);
  };
  const onChangeEName = (e) => {
    setEName(e.target.value);
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangeImg = (e) => {
    setImg(e.target.files[0]);
    setImgsrc(URL.createObjectURL(e.target.files[0]));
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  // userId 추가
  const saveMusician = async () => {
    if ((KName || EName) && account && email && img && description && userId) {
      console.log(snsList);
      const formData = new FormData();
      formData.append("KName", KName);
      formData.append("EName", EName);
      formData.append("account", account);
      formData.append("email", email);
      formData.append("musicianfile", img);
      formData.append("description", description);
      formData.append("userId", userId);
      // formData.append("snsList", snsList);
      var sns = [];
      for (let i = 0; i < snsList.length; i++) {
        sns.push(JSON.stringify(snsList[i]));
      }
      formData.append(`sns`, sns);

      await axios
        .post(`${server}/user/register`, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          navigate("/musician");
        });
    } else if (!KName && !EName) {
      alert("이름을 입력해주세요.");
    } else if (!account) {
      alert("지갑을 연결해주세요.");
    } else if (!email) {
      alert("이메일을 입력해주세요.");
    } else if (!description) {
      alert("소개글을 입력해주세요.");
    } else if (!img) {
      alert("뮤지션의 사진 선택해주세요.");
    } else if (!userId) {
      alert("userID 가 없습니다.");
    }
  };
  const addSNS = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    if (count) {
      setSnsList([
        ...snsList,
        {
          type: "homepage",
          url: "",
          idx: count,
        },
      ]);
    }
  }, [count]);
  return (
    <div>
      <div id="registerpage">
        <div className="pagetitle">뮤지션 등록</div>
        <div>
          <div>
            {img && (
              <img
                className="profileimg"
                alt="sample"
                src={imgsrc}
                style={{ margin: "auto" }}
              />
            )}
          </div>
          <input
            className="fileinput"
            type="file"
            onChange={(e) => onChangeImg(e)}
            name="musicianfile"
          />
        </div>
        <div>
          <div className="registertext">name </div>
          <input
            className="musicianinput"
            type="text"
            placeholder="뮤지션의 한글 이름을 입력해주세요."
            onChange={onChangeKName}
          ></input>
        </div>
        <div>
          <input
            className="musicianinput"
            type="text"
            placeholder="뮤지션의 영어 이름을 입력해주세요."
            onChange={onChangeEName}
          ></input>
        </div>
        <div>
          <div className="registertext">email</div>
          <input
            className="musicianinput"
            type="text"
            placeholder="이메일을 입력해주세요."
            onChange={onChangeEmail}
          ></input>
        </div>
        <div>
          <div className="registertext">info</div>
          <textarea
            className="musicianinfoinput"
            type="text"
            placeholder="뮤지션의 소개글을 입력해주세요."
            onChange={onChangeDescription}
          ></textarea>
        </div>
        <div id="sns_wrapper">
          <div className="registertext">
            SNS{" "}
            <button className="snsAddBtn" onClick={addSNS}>
              +
            </button>
          </div>
          <ul id="snsList">
            {snsList.map((sns) => (
              <SNSList
                snsList={snsList}
                setSnsList={setSnsList}
                idx={sns.idx}
              />
            ))}
          </ul>
        </div>
        <div>
          <button className="editbtn" onClick={saveMusician}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
