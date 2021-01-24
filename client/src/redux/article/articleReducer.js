import { articleActionTypes } from './articleActionTypes';

const initialState = {
   articles: [],
   isFetching: false,
   articleMessage: null
}

const articleReducer = function (state = initialState, action) {
   switch (action.type) {
      case articleActionTypes.GET_ARTICLES_START:
         return { ...state, articleMessage: null, isFetching: true }
      case articleActionTypes.GET_ARTICLES_SUCCESS:
         return { ...state, isFetching: false, articles: action.payload, articleMessage: action.message };
      case articleActionTypes.GET_ARTICLES_ERROR:
         return { ...state, isFetching: false, articleMessage: action.message };

      case "DISMISS_MESSAGE_ARTICLE":
         return { ...state, articleMessage: action.message };
      default:
         return state;
   }
}

export default articleReducer;