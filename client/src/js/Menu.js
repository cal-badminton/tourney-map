import React from 'react';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      messages: []
    };

    props.socket.on("receive message", function(data) {
      if (this.mounted) {
        let copy = this.state.messages.slice();
        copy.unshift(data.message);
        if (copy.length > 8) {
          copy.pop();
        }
        this.setState({messages: copy});
      }
    }.bind(this));

    this.getInfo = this.getInfo.bind(this);

    this.typeChange = this.typeChange.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.infoChange = this.infoChange.bind(this);
    this.highlightChange = this.highlightChange.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  titleChange(e) {
    this.props.updateTile(this.props.row, this.props.col, this.props.type, e.target.value,
      this.props.info, this.props.highlight);
  }

  typeChange(e) {
    this.props.updateTile(this.props.row, this.props.col, e.target.value, this.props.title,
      "", this.props.highlight);
  }

  infoChange(e) {
    this.props.updateTile(this.props.row, this.props.col, this.props.type, this.props.title,
      e.target.value, this.props.highlight);
  }

  highlightChange(e) {
    this.props.updateTile(this.props.row, this.props.col, this.props.type, this.props.title,
      this.props.info, e.target.value);
  }

  getInfo() {
    if (this.props.type === "text") {
      return (
        <div>
          <p className="menu-text">Info:</p>
          <input type="text" value={this.props.info} onChange={this.infoChange}/>
        </div>
      )
    }
  }

  getMessages() {
    let list = []
    let messages = [];
    for (let i = this.state.messages.length - 1; i >= 0; i--) {
      messages.push(<hr className="chat-line" key={-i - 1}/>);
      messages.push(<li className="chat-text" key={i}>{this.state.messages[i]}</li>);
    }
    list.push(<ul>{messages}</ul>);
    return messages;
  }

  handleKey(event) {
    if (event.key == 'Enter' && this.state.input != "") {
      this.props.socket.emit("send message", {name: this.props.name, message: this.state.input});
      this.setState({input: ""});
    }
  }

  handleInput(e) {
    this.setState({input: e.target.value});
  }

  render() {
    return (
      <div className="tourney-menu">
        <div className="tourney-name">{this.props.name}</div>
        <div>
          <p className="menu-text">Type:</p>
          <select value={this.props.type} onChange={this.typeChange}>
            <option value="">Blank</option>
            <option value="text">Text</option>
            <option value="timer">Timer</option>
          </select>
        </div>
        <div>
          <p className="menu-text">Title:</p>
          <input type="text" value={this.props.title} onChange={this.titleChange}/>
        </div>
        <div>{this.getInfo()}</div>
        <div>
          <p className="menu-text">Highlight:</p>
          <select value={this.props.highlight} onChange={this.highlightChange}>
            <option value="">None</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
          </select>
        </div>
        <div className="chat-box">
          <div>{this.getMessages()}</div>
          <div>
            <p className="menu-text">Chat:</p>
            <input type="text" value={this.state.input}
              onChange={this.handleInput} onKeyPress={this.handleKey}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Menu;
