import React, { useState } from "react";
// import { Link } from 'react-router-dom';

import { Menu, Dropdown } from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { postArticleLikeService, postArticleBookmarkService } from "./../../services/articleApi";

import "./articleSidebarMenu.css";

const ArticleSidebarMenu = ({ screen, isAuthenticated, articleData, currentUserId }) => {
  const [state, setState] = useState({
    copied: false,
    isLiked:
      currentUserId && articleData.articleLikes.users && articleData.articleLikes.users.indexOf(currentUserId) !== -1
        ? true
        : false,
    numLikes: articleData.articleLikes.users.length,
    isBookmarked:
      currentUserId &&
      articleData.articleBookmarks.users &&
      articleData.articleBookmarks.users.indexOf(currentUserId) !== -1
        ? true
        : false,
    numBookmarks: articleData.articleBookmarks.users.length,
    errorMsgLike: null,
    errorMsgBookmark: null,
  });

  const isMobile = screen === "mobile";
  const testUrl = window.location.href;

  const handleLike = async () => {
    try {
      const response = await postArticleLikeService(articleData._id);
      if (response.status === 200) {
        setState({
          ...state,
          isLiked: !state.isLiked,
          numLikes: state.isLiked ? state.numLikes - 1 : state.numLikes + 1,
        });
      } else {
        throw new Error("Failed to Like Article!");
      }
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response;
      console.log(errorObject.data.message || errorObject.data);
      setState({ ...state, errorMsgLike: errorObject.data.message || errorObject.data });
      setTimeout(function () {
        setState({ ...state, errorMsgLike: null });
      }, 2000);
    }
  };
  const handleBookmark = async () => {
    try {
      const response = await postArticleBookmarkService(articleData._id);
      if (response.status === 200) {
        setState({
          ...state,
          isBookmarked: !state.isBookmarked,
          numBookmarks: state.isBookmarked ? state.numBookmarks - 1 : state.numBookmarks + 1,
        });
      } else {
        throw new Error("Failed to Bookmark Article!");
      }
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response;
      console.log(errorObject.data.message || errorObject.data);
      setState({ ...state, errorMsgBookmark: errorObject.data.message || errorObject.data });
      setTimeout(function () {
        setState({ ...state, errorMsgBookmark: null });
      }, 2000);
    }
  };
  return (
    <Menu
      fluid
      text={!isMobile}
      icon
      vertical={!isMobile}
      fixed={isMobile ? "bottom" : null}
      widths={isMobile ? 3 : null}
    >
      {isAuthenticated && currentUserId && (
        <>
          <Menu.Item
            icon
            onClick={() => handleLike()}
          >
            <button className={`ui circular icon button ${!isMobile ? "marginBottomReaction" : ""}`}>
              <i className={`heart  ${state.isLiked ? "red" : ""} icon`}></i>
            </button>

            <span style={{ margin: "0.5em" }}>{state.numLikes}</span>
            {state.errorMsgLike && <span className="errorMessageReaction">{state.errorMsgLike}</span>}
          </Menu.Item>

          <Menu.Item
            icon
            onClick={() => handleBookmark()}
          >
            <button className={`ui circular icon button ${!isMobile ? "marginBottomReaction" : ""}`}>
              <i className={`bookmark  ${state.isBookmarked ? "blue" : ""} icon`}></i>
            </button>

            <span style={{ margin: "0.5em" }}>{state.numBookmarks}</span>
            {state.errorMsgBookmark && <span className="errorMessageReaction">{state.errorMsgBookmark}</span>}
          </Menu.Item>
        </>
      )}

      <Dropdown
        item
        icon="share alternate"
        floating
        direction={isMobile ? "left" : null}
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <CopyToClipboard
              text={window.location.href}
              onCopy={() => setState({ ...state, copied: true })}
            >
              <div className="ui left icon transparent mini input ">
                <input
                  readOnly
                  value={window.location.href}
                  size="10"
                />
                <i className={`${state.copied ? "check" : "copy outline"} icon`}></i>
              </div>
            </CopyToClipboard>
          </Dropdown.Item>

          <Dropdown.Item>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://twitter.com/intent/tweet?text="${articleData.title} Link: "&url=${testUrl}`}
            >
              Share to Twitter
            </a>
          </Dropdown.Item>
          <Dropdown.Item>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${testUrl}&title=${articleData.title}`}
            >
              Share to LinkedIn
            </a>
          </Dropdown.Item>
          <Dropdown.Item>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.facebook.com/sharer.php?u=${testUrl}`}
            >
              Share to Facebook
            </a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu>
  );
};

export default ArticleSidebarMenu;
