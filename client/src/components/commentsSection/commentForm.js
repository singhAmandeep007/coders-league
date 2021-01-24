import React, { useRef } from 'react'
import { Comment, Form, Button } from 'semantic-ui-react';

const CommentForm = ({ currentUser, articleId, commentService, dispatch }) => {
   console.log(articleId)
   const textRef = useRef(null);

   const handleSubmit = async () => {

      let text = textRef.current.value;
      if (!text) {
         return;
      }
      try {
         const response = await commentService(articleId, { text });
         if (response.status === 200) {
            textRef.current.value = '';
            dispatch({
               ...response.data.data, isAuthor: true, user: {
                  photo: currentUser.photo,
                  fullname: currentUser.fullname,
                  username: currentUser.username
               }
            })
         }
         else {
            throw new Error('Failed to create Comment!')
         }
      }
      catch (error) {
         const { response } = error;
         const { request, ...errorObject } = response;
         console.log(errorObject.data.message)
      }
   }

   return (
      <Comment key={currentUser.id}>
         <Comment.Avatar src={currentUser.photo} />
         <Comment.Content>
            <div>
               <Comment.Author >{currentUser.fullname}</Comment.Author>
            </div>

            <Form onSubmit={handleSubmit} >
               <Form.Field style={{ clear: 'none', marginTop: '0.7em' }}>
                  <textarea rows='2' ref={textRef}></textarea>
               </Form.Field>
               <Button compact content='Submit' primary />
            </Form>

         </Comment.Content>
      </Comment>
   )
}

export default CommentForm;