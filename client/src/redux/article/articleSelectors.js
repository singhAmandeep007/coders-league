import { createSelector } from "reselect";

const selectArticles = (state) => state.articleReducer;

export const selectAllArticles = createSelector([selectArticles], (articleReducer) => articleReducer.articles);
