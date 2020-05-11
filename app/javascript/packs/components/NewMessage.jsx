import React from 'react';

class NewMessage extends React.Component {

  state = { body: '', sender: '', errors: {} };

  handelSumbit = (event) => {
    event.preventDefault();
    // I validate the form so we create valid message for local and remote server
    if (this.validate()) {
      const newMessage = { body: this.state.body, sender: this.state.sender, posted_at: new Date().toJSON() }
      this.props.onSubmit(newMessage);
      this.setState({ body: '', sender: '' });
    }
  };

  validate = () => {
    let errors = {};
    if (this.state.body == '') {
      errors['body'] = "can't be blank";
    }

    if (this.state.sender == '') {
      errors['sender'] = "can't be blank";
    }
    this.setState({ errors })
    return Object.keys(errors).length == 0;
  }

  render() {
    const { body, sender, errors } = this.state;
    const bodyError = errors['body'];
    const senderError = errors['sender'];
    return (
      <div className="ui segment">
        <form onSubmit={this.handelSumbit} className="ui form">
          <div className={`field ${senderError ? 'error' : ''}`}>
            <label>Sender</label>
            <input name="sender" value={sender} type="text" onChange={e => this.setState({ sender: e.target.value })}></input>
            {senderError && <label>{senderError}</label>}
          </div>
          <div className={`field ${bodyError ? 'error' : ''}`}>
            <label>Body</label>
            <input name="body" value={body} type="text" onChange={e => this.setState({ body: e.target.value })}></input>
            {bodyError && <label>{bodyError}</label>}
          </div>

          <button type="submit" className="ui primary button">Save</button>
        </form>
      </div>
    );

  }
};

export default NewMessage;