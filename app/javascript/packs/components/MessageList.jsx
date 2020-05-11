import React from 'react';
import Message from './Messaje'

const MessageList = (props) => {
  const messages = [];
  props.messages.forEach((message, index) => {
    const id = message.id || index
    messages.push(<Message key={id} message={message} />);
  });

  return <div className="ui comments">{messages}</div>
};

export default MessageList;