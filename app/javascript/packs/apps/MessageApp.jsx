import React from 'react';
import MessageList from '../components/MessageList';
import NewMessage from '../components/NewMessage';
import axios from 'axios';
class MessageApp extends React.Component {
  state = { messages: [], localMessages: [], onLine: false, searchingMessage: false };

  // search messages form the server
  searchMessages = async () => {
    this.setState({ searchingMessage: true });
    const response = await axios.get('http://localhost:3000/messages.json');
    return response.data;
  };

  // search message from the server and merge with local message if there are
  getAllMessages = () => {
    const messages = this.searchMessages();
    messages.then((messages) => {
      if (this.containsLocalMessages()) {
        let localMessages = this.getMessagesFromLocal();
        messages = [...messages, ...localMessages];
        messages = this.sortMessages(messages);
      }
      this.setState({ messages: messages, searchingMessage: false });
    });
  };

  // sort message, we merge server and local messages and call this method to sort them
  sortMessages = (messages) => {
    return messages.sort((a, b) => {
      let d1 = Date.parse(a.posted_at);
      let d2 = Date.parse(b.posted_at);
      return (d1 < d2) ? 1 : -1
    });
  }

  // post new message to the server
  postNewMessage = async (message) => {
    const response = await axios.post('http://localhost:3000/messages.json', message).catch((e) => {
      // there is a Message validator on NewMessage component
      console.log("error", e.response.data);
    });
    if (response) {
      this.addNewMessage(response.data);
    }
  }

  // save and set new local message on state
  postNewLocalMessages = (message) => {
    this.saveNewMessageLocal(message);
    const messages = this.sortMessages([...this.state.messages, ...this.getMessagesFromLocal()]);
    this.setState({ messages: messages });
  }

  // save new message, local or port to the server
  saveNewMessage = (message) => {
    if (this.state.onLine) {
      this.postNewMessage(message);
    } else {
      this.postNewLocalMessages(message);
    }
  }

  // add new message to
  addNewMessage = (message) => {
    const messages = this.sortMessages([...this.state.messages, message, ...this.getMessagesFromLocal()]);
    this.setState({ messages: messages });
  }

  // save new message on local store and set local messages state
  saveNewMessageLocal = (message) => {
    var localMessages = this.getMessagesFromLocal();
    localMessages.push(message);
    localStorage.setItem('localMessages', JSON.stringify(localMessages));
    this.setLocalMessages(localMessages);
  }

  // set local message state
  setLocalMessages = (messages) => {
    localStorage.setItem('localMessages', JSON.stringify(messages));
    this.setState({ localMessages: [...messages] });
  }

  // get messages from local store
  getMessagesFromLocal = () => {
    const data = localStorage.getItem('localMessages');
    return JSON.parse(data) || [];
  }

  // check if there are local messages
  containsLocalMessages = () => {
    return this.getMessagesFromLocal().length > 0;
  }

  // swithc on line / off line
  switchPooling = () => {
    const onLine = !this.state.onLine
    this.setState({ onLine });
    // if we are on line and there are local message we send them to the server
    if (onLine && this.containsLocalMessages()) {
      this.sendLocalMessages();
    }

  };

  // send local messages to the server
  sendLocalMessages = () => {
    const localMessages = this.getMessagesFromLocal();
    const msg = localMessages.shift();
    if (msg) {
      this.postNewMessage(msg);
      this.setLocalMessages(localMessages);
      this.sendLocalMessages();
    }
  }

  componentDidMount() {
    // get all message , server + local
    this.getAllMessages();
    this.interval = setInterval(() => {
      if (this.state.onLine) {
        if (!this.state.searchingMessage) {
          this.getAllMessages();
        }
      }
    }, 1000);
  }

  render() {
    const localMessages = this.getMessagesFromLocal();
    const onLine = this.state.onLine;

    return (
      <div className="container segment">
        <div className="ui three item menu">
          <h1 className="ui header">Messages</h1>
        </div>

        <div className="ui two column doubling stackable grid container">
          <div className="row">
            <div className="column">
              <NewMessage onSubmit={this.saveNewMessage} />
            </div>
            <div className="column">
              <button className={`ui button ${onLine ? "green" : "red"}`} onClick={this.switchPooling} >{onLine ? 'On Line' : 'Off Line'}</button>
            </div>

          </div>
          <div className="row">
            <div className="column">
              <h3 className="ui header">Messages</h3>
              <MessageList messages={this.state.messages} />
            </div>
            <div className="column">
              <h3 className="ui header">Local Messages</h3>
              <MessageList messages={localMessages} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default MessageApp;

