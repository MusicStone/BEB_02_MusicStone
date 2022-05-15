import React, { useState, useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styled from 'styled-components';

const SNSList = ({ snsList, setSnsList, idx }) => {
    const [url, setUrl] = useState("");
    const [type, setType] = useState("homepage");

    const handleInput = (e) => {
        setUrl(e.target.value);
    }
    //delete에서 무조건 제일 뒤에꺼가 삭제됨 렌더링 과정에서 문제인거 같음 일단 나중에 처리
    const deleteSNS = () => {
        setSnsList(snsList.filter((sns) => sns.idx !== idx))
    }
    const typeParser = () => {
        //앞에 http 프로토콜 유무에 상관없이 동일하게 읽어오게
        const urlStr = url.includes('://') ? url : `http://${url}`
        //도메인별로 분할
        const urlParser = urlStr.split('.');
        //체크할 type
        let newType

        //url에서 sns의 위치를 읽어옴
        if (urlParser.length >= 2) {
            newType = urlParser[0].includes('www') ? urlParser[1] : urlParser[0];
        } else {
            newType = urlParser[0]
        }

        //type에서 프로토콜이 남아있는 경우 제외
        if (newType.includes('://')) {
            newType = newType.split('://')[1];
        }
        setType(findType(newType));
    }
    const updateState = () => {
        setSnsList(snsList.map((sns, curId) => {
            return (
                curId === idx
                    ? { type, url, idx: sns.idx }
                    : sns
            )
        }));
    }
    const showImg = () => {
        return <Img src={`../img/SNSIcon/${type}.png`} />
    }

    useEffect(() => {
        setType('homepage');
        updateState();
        typeParser();
    }, [url]);

    useEffect(() => {
        updateState();
    }, [type]);

    return (
        <Li>
            <ICON>{showImg()}</ICON>
            <Input value={url} onChange={handleInput} />
            <RemoveBtn onClick={deleteSNS}><DeleteForeverIcon /></RemoveBtn>
        </Li>)
}
export default SNSList;

const findType = (type) => {
    let result
    switch (type) {
        case 'instagram':
            result = 'instagram';
            break;
        case 'twitter':
            result = 'twitter';
            break;
        case 'facebook':
            result = 'facebook'
            break;
        case 'youtube':
            result = 'youtube'
            break;
        case 'tiktok':
            result = 'tiktok'
            break;
        default:
            result = 'homepage';
            break;
    }

    return result;
}


const Li = styled.li`
margin: 10px auto;
width: 420;
display: flex;
justify-content: space-around;
`;
const ICON = styled.div`
display:flex;
justify-content: center;
align-items: center;
width: 50px;
`;
const Img = styled.img`
width: 30px;
height: 30px;
`;
const Input = styled.input`
width: 320px;
padding: 0 10px;
`;
const RemoveBtn = styled.button`
width: 50px;
background-color: transparent;
cursor: pointer;
border:0;
color:white;
`;