import { commentActionTypes } from './commentActionTypes';

const initialState = {
   comments: []
}

export const commentReducer = function (state = initialState, action) {
   //console.log(action);
   switch (action.type) {
      case commentActionTypes.CREATE_COMMENT_START:
         return { ...state };
      case commentActionTypes.CREATE_COMMENT_SUCCESS:
         return { ...state, comments: [...state.comments, action.payload.comment], message: 'success' };
      case commentActionTypes.CREATE_COMMENT_ERROR:
         return { ...state, message: 'error' };
      default:
         return state;
   }
};