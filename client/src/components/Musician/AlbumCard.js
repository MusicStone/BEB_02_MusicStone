import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";

const AlbumCard = ({ album }) => {
  const server = process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";

  return (
    <Link Link to={`/album/${album.id}`
    } style={{ textDecoration: 'none' }}>
      <CardContainer>
        <Img src={`${server}/${album.originalname}`} />
        <Name>{album.name}</Name>
      </CardContainer>
    </Link >
  );
}

export default AlbumCard;

const CardContainer = styled.div`
    margin: 20px;
    width: 200px;
    height: 250px;
    cursor: pointer;
    font-family: "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    `;
const Img = styled.img`
width: 200px;
height: 200px;
`;

const Name = styled.h3`
margin: 5 auto;
text-align: center;
`;