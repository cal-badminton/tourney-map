import React from 'react';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.row = props.row;
    this.col = props.col;
    this.handleClick = props.click;
    this.handleDrop = props.drop;
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.getTime = this.getTime.bind(this);
    this.checkID = this.checkID.bind(this);

    this.state = {
      time: 0
    };

    props.socket.on('update timer', function(data) {
      let key = "" + this.row + props.name + this.col;
      console.log(key);
      console.log(data.key);
      if (key === data.key) {
        console.log("gotem");
        this.setState({time: data.time})
      }
    }.bind(this));
  }

  handleDrag(e) {
    e.dataTransfer.setData("row", e.target.getAttribute("data-row"));
    e.dataTransfer.setData("col", e.target.getAttribute("data-col"));
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  getStyle() {
    if (this.props.highlight === "red") {
      return {
        backgroundColor: "#f44242"
      };
    } else if (this.props.highlight === "green") {
      return {
        backgroundColor: "#42f442"
      };
    } else if (this.props.highlight === "blue") {
      return {
        backgroundColor: "#427cf4"
      };
    } else if (this.props.highlight === "yellow") {
      return {
        backgroundColor: "#f4f442"
      };
    } else if (this.props.highlight === "orange") {
      return {
        backgroundColor: "#f47a42"
      };
    }
  }

  toggleTimer() {
    this.props.socket.emit("toggle timer", {name: this.props.name, row: this.row, col: this.col});
  }

  resetTimer() {
    this.props.socket.emit("reset timer", {name: this.props.name, row: this.row, col: this.col});
  }

  getTime() {
    let min = Math.floor(this.state.time / 60);
    let sec = this.state.time % 60;
    let extra = "";
    if (sec < 10) {
      extra = 0;
    }
    return "" + min + ":" + extra + sec;
  }

  getInfo() {
    if (this.props.type === "timer") {
      return (
        <div data-row={this.row} data-col={this.col}>
          {this.getTime()}
          <div>
            <button data-row={this.row} data-col={this.col}
              className="timer-button" type="button" onClick={this.toggleTimer}>S/P</button>
            <button data-row={this.row} data-col={this.col}
              className="timer-button" type="button" onClick={this.resetTimer}>R</button>
          </div>
        </div>
      );
    } else {
      return this.props.info;
    }
  }

  checkID() {
    if (this.row == this.props.crow && this.col == this.props.ccol) {
      return "selected";
    }
    return "";
  }

  render() {
    return (
      <div onClick={this.handleClick} data-row={this.row} data-col={this.col} draggable="true" onDragOver={this.handleDragOver}
        onDragStart={this.handleDrag} onDrop={this.handleDrop} className="grid-tile" id={this.checkID()} style={this.getStyle()}>
        <div className="tile-title" data-row={this.row} data-col={this.col}>
          {this.props.title}
        </div>
        <div data-row={this.row} data-col={this.col}>
          {this.getInfo()}
        </div>
      </div>
    )
  }
}

export default Tile
