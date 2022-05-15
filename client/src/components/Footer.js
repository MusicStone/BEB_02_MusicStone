import React from "react";
import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <div>
      <div className="footer" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        © 2022 Copyright:
        <span>{"  "}MusicStone</span>
        <a
          className="foootericon"
          href="https://github.com/codestates/BEB_02_MusicStone"
        >
          <AiFillGithub></AiFillGithub>
        </a>
      </div>
    </div>
  );
}
