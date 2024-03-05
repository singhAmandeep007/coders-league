import React, { useReducer, useEffect } from "react";
import { Container, Grid, Header } from "semantic-ui-react";

import { getUserReadingList } from "./../../services/userApi";

import RenderArticles from "./renderArticles";

import PlaceholderCard from "./../../components/placeholderCard/placeholderCard";

const ReadingListPage = ({ currentUser }) => {
  const initialState = {
    loading: true,
    errorMsg: "",
    articleData: [],
  };

  function reducer(state, action) {
    switch (action.type) {
      case "FETCH_SUCCESS":
        return { ...state, loading: false, articleData: action.payload };
      case "FETCH_FAILED":
        return { loading: false, error: action.payload, articleData: [] };
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getUserReadingList()
      .then((response) => {
        //console.log(response.data.data);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.data.map(({ article }) => article),
        });
      })
      .catch((error) => {
        dispatch({
          type: "FETCH_FAILED",
          payload: error.message,
        });
      });
  }, []);

  return (
    <Container>
      <Grid
        stackable
        padded="vertically"
      >
        <Grid.Row centered>
          <Header
            as="h2"
            icon
          >
            <i className="book  circular icon"></i>
            Reading List
            <Header.Subheader>Search your article bookmark list and check them out.</Header.Subheader>
          </Header>
        </Grid.Row>

        <Grid.Row>
          {state.loading ? (
            <Grid.Column>
              <PlaceholderCard num={4} />
            </Grid.Column>
          ) : state.articleData && state.articleData.length > 0 ? (
            <RenderArticles articleData={state.articleData} />
          ) : null}
        </Grid.Row>
      </Grid>
    </Container>
  );
};
export default ReadingListPage;
