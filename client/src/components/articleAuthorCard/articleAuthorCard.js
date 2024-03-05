import React from "react";
import { Card } from "semantic-ui-react";
import { Link } from "react-router-dom";

import convertIsoToDate from "./../../utils/IsoDateConvert";

const ArticleAuthorCard = ({ userData, isAuthenticated, currentUserId, setUserFollowing, userFollowing }) => {
  const isFollowing = userFollowing && userFollowing.indexOf(userData.id) !== -1;

  return (
    <Card
      fluid
      raised
    >
      <Card.Content>
        <img
          className="ui mini left floated image"
          src={userData.photo}
          alt={userData.username}
        />
        <Card.Header
          as={Link}
          to={`/u/${userData.username}`}
        >
          {userData.fullname}
        </Card.Header>
        <Card.Meta style={{ fontSize: "0.83rem", lineHeight: "1.5em" }}>
          <i className="calendar alternate icon"></i>&nbsp;&nbsp;
          {convertIsoToDate(userData.createdAt)}
        </Card.Meta>
        {userData.bio && (
          <Card.Description style={{ fontSize: "0.83rem", lineHeight: "1.5em", paddingBottom: "1em" }}>
            {userData.bio}
          </Card.Description>
        )}
        {/* user cant follow himself */}
        {isAuthenticated && currentUserId !== userData.id && (
          <button
            className={`ui primary tiny fluid ${isFollowing ? "basic" : ""} button`}
            onClick={() => setUserFollowing(userData.id)}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </Card.Content>
    </Card>
  );
};

export default ArticleAuthorCard;
