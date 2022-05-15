import React, { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const PreviewStream = ({ stoneId, img }) => {
    const audioRef = useRef(null);
    const imgRef = useRef(null);
    const [isPlay, setIsPlay] = useState(false);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [musicLength, setMusicLength] = useState(0);
    const server =
        process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

    const handlePlayBtn = () => {
        isPlay ? audioRef.current.pause() : audioRef.current.play();
        setIsPlay(!isPlay);
    }
    function updateDuration() {
        setMusicLength(audioRef.current.duration);
    }
    function countPlayTime() {
        const curTime = audioRef.current.currentTime.toFixed();
        setSecond(curTime % 60);
        setMinute(Math.floor(curTime / 60));
    }

    function showTimer() {
        const tempTotalSec = (musicLength % 60).toFixed()

        const calSec = second >= 10 ? second : `0${second}`
        const calTotalMin = Math.floor(musicLength / 60);
        const calTotalSec = tempTotalSec >= 10 ? tempTotalSec : `0${tempTotalSec}`;

        return (
            <Timer>
                {`${minute}:${calSec} `}
                /
                {musicLength !== Infinity ? ` ${calTotalMin}:${calTotalSec}` : ' ∞'}
            </Timer>)
    }

    //interval 관련

    const interval = useRef();

    useEffect(() => {
        interval.current = countPlayTime;
    }, [countPlayTime])

    useEffect(() => {
        imgRef.current.style.animationPlayState = isPlay ? 'running' : 'paused';
        if (isPlay) {
            function tick() {
                interval.current();
            }
            let id = setInterval(tick, 1000)
            return () => clearInterval(id);
        }
    }, [isPlay])

    useEffect(() => {
        if (minute) {
            audioRef.current.currentTime = 0;
            alert('미리듣기는 1분까지만 제공됩니다.');
        }
    }, [minute]);

    return (
        <StreamingWrapper>
            <Play>
                <ImgBox>
                    <Img src={`${server}/${img}`} alt={stoneId} ref={imgRef} />
                </ImgBox>
                <BtnWrapper>
                    <StreamingBtn onClick={() => handlePlayBtn()}>{isPlay ? <PauseIcon /> : <PlayArrowIcon />}</StreamingBtn>
                </BtnWrapper>
            </Play>
            {showTimer()}
            {/* 현재 음원 정해진게 없어서 하나 하드코딩해놓음 */}
            <audio src={`${server}/playlist/streaming/${stoneId}`} onLoadedData={updateDuration} ref={audioRef} type="audio/mpeg"></audio>
        </StreamingWrapper >
    );
}

export default PreviewStream;

const StreamingWrapper = styled.div`
width: 100%;
height: 100%;
display:flex;
flex-direction: column;
`;
const Play = styled.div`
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
`;
const ImgBox = styled.div`
margin: 50px;
height: 300px;
width: 300px;
position:absolute;
border-radius: 70%;
overflow: hidden;
`;
const Img = styled.img`
width: 300px;
height: 300px;
-webkit-user-drag: none;
animation: rotate_image 10s linear infinite;
transform-origin: 50% 50%;
`
const BtnWrapper = styled.div`
position:absolute;
`;
const StreamingBtn = styled.button`
background-color:#333333;
width: 60px;
height: 60px;
border: 0;
outline: none;
border-radius: 30px;
cursor: pointer;
color: white;
`;
const Timer = styled.div`
color: #ABABAB;
height: 50px;
text-align: center;
`;