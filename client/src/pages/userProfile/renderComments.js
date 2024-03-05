import React, { useState } from "react";
import { Link } from "react-router-dom";

import PlaceholderComment from "./../../components/placeholderComment/placeholderComment";
import { getCommentsService } from "./../../services/commentApi";

function RenderArticles({ comments, userId }) {
  const [state, setState] = useState({
    loading: false,
    comments: [...comments],
    page: 1,
    hasMore: true,
    error: null,
  });

  const getMoreComments = (page) => {
    setState({
      ...state,
      loading: true,
    });

    getCommentsService({
      user: userId,
      page: page,
      fields: "article,id,text,-user",
    }).then(
      (response) => {
        if (response.data.data.length < 9) {
          setState({
            ...state,
            loading: false,
            comments: [...state.comments, ...response.data.data],
            page: page,
            hasMore: false,
          });
          return;
        }
        setState({
          ...state,
          loading: false,
          comments: [...state.comments, ...response.data.data],
          page: page,
        });
      },
      (err) => {
        const { response } = err;
        const { request, ...errorObject } = response;
        setState({
          ...state,
          loading: false,
          error: errorObject.data.message || errorObject.data,
        });
      }
    );
  };

  return (
    <div className="ui olive secondary segment">
      <div className="ui segments">
        {state.comments.map((comment) => {
          return (
            <div
              className="ui raised segment"
              key={comment.id}
            >
              <h4 className="ui header">
                <Link to={`/u/${comment.article.user.username}/a/${comment.article.slug}`}>
                  {comment.article.title}
                </Link>
                <div
                  className="sub header"
                  style={{ fontSize: "0.8em", lineHeight: "1.4em" }}
                >
                  {comment.text}
                </div>
              </h4>
            </div>
          );
        })}
      </div>
      {state.loading ? <PlaceholderComment num={3} /> : null}
      {state.hasMore && (
        <button
          className="ui primary button"
          onClick={() => getMoreComments(state.page + 1)}
          style={{
            margin: "0 auto",
            display: "block",
          }}
        >
          <i className="icon plus"></i>
          Load more Comments...
        </button>
      )}
      {!state.hasMore && <div className="ui horizontal divider">Yay ! You have seen all Comments !</div>}
      {state.error && (
        <div class="ui negative message">
          <div class="header">Error</div>
          <p>{state.error}</p>
        </div>
      )}
    </div>
  );
}

export default RenderArticles;
