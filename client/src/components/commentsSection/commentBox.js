import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Comment, Icon } from 'semantic-ui-react';

import { postCommentLikeService } from './../../services/commentApi'

import convertIsoToDate from './../../utils/IsoDateConvert';
import './commentBox.css';
const CommentBox = ({ comment, isAuthenticated, updateComment, deleteComment }) => {

   const commentText = useRef(null)
   const [state, setState] = useState({
      isEditable: false,
      isLiked: true
   })


   return (
      <Comment>
         <Comment.Avatar src={comment.user.photo} />
         <Comment.Content>
            <Comment.Author as={Link} to={`/u/${comment.user.username}`}>{comment.user.fullname}</Comment.Author>
            <Comment.Metadata>
               <div>{convertIsoToDate(comment.createdAt)}</div>
            </Comment.Metadata>

            {isAuthenticated && comment.isAuthor && <Comment.Metadata style={{ float: 'right' }}>
               <div >
                  <Icon
                     name={!state.isEditable ? 'edit' : 'close'}
                     link
                     onClick={() => setState({
                        ...state,
                        isEditable: !state.isEditable
                     })}
                  />
                  &nbsp;&nbsp;
                  <Icon
                     name='trash'
                     link
                     onClick={() => deleteComment(comment._id)}
                  />
               </div>
            </Comment.Metadata>}

            {!state.isEditable ? <div
               className="text customText"
               ref={commentText}
            >
               <p>{comment.text}</p>
            </div> : <div className="ui form" style={{ margin: '0.7em 0em' }}>
                  <textarea
                     className='field'
                     rows='2'
                     ref={commentText}
                     defaultValue={comment.text}
                  >

                  </textarea>
               </div>
            }

            {isAuthenticated && <Comment.Actions>

               <Comment.Action >
                  <i className={`heart ${state.isLiked ? 'red' : ''} icon`} onClick={() => setState({ ...state, isLiked: !state.isLiked })}></i>
               </Comment.Action>
               {/* <Comment.Action>Reply</Comment.Action> */}

               {state.isEditable && <Comment.Action
                  style={{ float: 'right' }}
               ><span className="saveLabel" onClick={async () => {
                  const text = commentText.current.value.trim();
                  if (text) {
                     await updateComment(comment._id, text);
                  }
                  setState({ ...state, isEditable: false })
               }}>Save</span>
               </Comment.Action>}

            </Comment.Actions>}
         </Comment.Content>
      </Comment>
   )

}

export default CommentBox;