import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Comment, Segment } from 'semantic-ui-react';

import { postCommentService, updateCommentService, deleteCommentService } from './../../services/commentApi';

import CommentBox from './commentBox';
import CommentForm from './commentForm';

const CommentsSection = ({ commentsData, isAuthenticated, currentUser, articleId }) => {

   const initialState = {
      collapsed: true,
      commentsData: currentUser ? commentsData.map(comment => {
         return { ...comment, isAuthor: currentUser.id === comment.user.id }
      }) : commentsData
   }

   function reducer(state, action) {
      switch (action.type) {
         case 'toggleCollapse':
            return { ...state, collapsed: !state.collapsed };
         case 'addComment':
            return { ...state, commentsData: [...state.commentsData, action.payload] };
         case 'updateComment':
            return {
               ...state, commentsData: state.commentsData.map(comment => {
                  if (comment.id === action.payload.commentId) {
                     return { ...comment, text: action.payload.text }
                  }
                  return comment;
               })
            };
         case 'deleteComment':
            return {
               ...state,
               commentsData: state.commentsData.filter((comment) => comment.id !== action.payload)
            };
         default:
            throw new Error();
      }
   }
   const [state, dispatch] = useReducer(reducer, initialState);

   const deleteComment = async (commentId) => {
      try {
         const response = await deleteCommentService(articleId, commentId);
         if (response.status === 204) {
            dispatch({ type: 'deleteComment', payload: commentId })
         }
         else {
            throw new Error('Failed to delete Comment!')
         }
      }
      catch (error) {
         const { response } = error;
         const { request, ...errorObject } = response;
         console.log(errorObject.data.message)
      }
   }
   const updateComment = async (commentId, text) => {
      try {
         const response = await updateCommentService(articleId, commentId, { text });
         // console.log(response.data.data)
         if (response.status === 200) {
            dispatch({
               type: 'updateComment', payload: {
                  commentId: response.data.data.id,
                  text: response.data.data.text
               }
            })
         }
         else {
            throw new Error('Failed to update Comment!')
         }
      }
      catch (error) {
         const { response } = error;
         const { request, ...errorObject } = response;
         console.log(errorObject.data.message)
      }
   }
   return (
      <>
         <div className="ui clearing segment">
            <h1 className="ui left floated  header" style={{ margin: '0em' }}>
               Comments
            </h1>
            <button className="ui icon right floated button" onClick={() => dispatch({ type: 'toggleCollapse' })}>
               <i className={`angle ${!state.collapsed ? 'up' : 'down'} icon`}></i>
            </button>
         </div>

         <Segment basic >
            <Comment.Group collapsed={state.collapsed}>

               {isAuthenticated && <CommentForm
                  currentUser={currentUser}
                  articleId={articleId}
                  commentService={postCommentService}
                  dispatch={(payload) => dispatch({ type: 'addComment', payload })}
               />}

               {(state.commentsData && state.commentsData.length > 0) ? state.commentsData.map(comment => {
                  return <CommentBox
                     key={comment._id}
                     comment={comment}
                     isAuthenticated={isAuthenticated}
                     updateComment={(commentId, text) => updateComment(commentId, text)}
                     deleteComment={(commentId) => deleteComment(commentId)}
                  />
               }) : !isAuthenticated ? <div className="ui message" >
                  <div className="header" style={{ fontWeight: 200 }}>
                     <Link to='/login'>Login</Link> or
               <Link to='/signup'> Signup</Link> to be the first to comment.🥇
               </div>
               </div> : null}
            </Comment.Group>
         </Segment>
      </>
   )
}

export default CommentsSection;

