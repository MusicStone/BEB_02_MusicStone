import React from "react";
import styled from "styled-components";
import musicstonelogo from "../img/musicstonelogo.png";

export function Main() {
  return (
    <div>
      <div className="f">
        <span className="maintxt">Collect</span>
        <br />
        <span className="maintxt">Your</span>
        <br />
        <span className="maintxt">Stones</span>
      </div>
      <img className="mainimg" src={musicstonelogo}></img>
      <hr />
    </div>
  );
}
