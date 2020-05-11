import React from 'react';
import ReactDOM from 'react-dom';
import MessageApp from '../apps/MessageApp';

const App = () => {
  return <MessageApp />
}

ReactDOM.render(<App />, document.querySelector('#root'))

