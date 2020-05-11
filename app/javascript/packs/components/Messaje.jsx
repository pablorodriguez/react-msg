import React from 'react';

const Message = (props) => {
  const { id, body, sender, created_at_in_words, posted_at } = { ...props.message };
  return (
    <div className="comment">
      <div className="content">
        <a className="author">{sender}:</a>
        <a className="text"> {body}</a>
        <div className="metadata pull-right">
          <div className="date">{posted_at}</div>
        </div>
      </div>
      <div className="ui divider"></div>
    </div>

  )
}

export default Message;