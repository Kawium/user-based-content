import React from "react";
import "./main.css";
import AddPost from "../addpost";

function Main() {
  return (
    <div className="main">
      <div className="background-box">
        <div className="allPosts">
          <h6>CARS - LIMITED BETA RELEASE</h6>
          <h3 className="mainTitle">All cars</h3>
          <AddPost />
        </div>
      </div>
    </div>
  );
}

export default Main;
