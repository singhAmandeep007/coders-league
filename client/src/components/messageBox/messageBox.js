import React, { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { Message } from "semantic-ui-react";

import { dismissMessageArticle } from './../../redux/message/messageActions';
import { dismissMessageUser } from './../../redux/message/messageActions';

const MessageBox = ({ message, dispatchFor }) => {
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (message) {
        if (dispatchFor === 'article') {
          dispatch(dismissMessageArticle())
        }
        if (dispatchFor === 'user') {
          dispatch(dismissMessageUser())
        }
      }
    });
    return () => {
      unlisten();
    }
  })

  const handleDismiss = () => {
    if (dispatchFor === 'article') {
      dispatch(dismissMessageArticle())
    }
    if (dispatchFor === 'user') {
      dispatch(dismissMessageUser())
    }
  }
  return (
    <div>
      {
        message && message.type === "success" ? (
          <Message
            onDismiss={handleDismiss}
            success
            header="Success"
            content={message.text}
            size='tiny'
            icon='bullhorn'
          />
        ) : message && message.type === "error" ? (
          <Message
            onDismiss={handleDismiss}
            error
            header="Error"
            content={message.text}
            size='tiny'
            icon='bullhorn'
          />
        ) : null
      }
    </div>
  )

}

export default React.memo(MessageBox);


