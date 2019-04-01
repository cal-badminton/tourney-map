import React from 'react';
import Menu from './Menu.js';
import Map from './Map.js';

class Tourney extends React.Component {
  constructor(props) {
    super(props);
    this.id = atob(props.id);
    this.updateMap = this.updateMap.bind(this);
    this.updateTile = this.updateTile.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      map: new Array(10).fill(new Array(18).fill(["", "", "", ""])),
      menu: ["", "", "", ""],
      row: 0,
      col: 0
    };

    props.socket.emit('get tourney', {name: this.id});

    props.socket.on('load tourney', function(data) {
      if (this.mounted) {
        console.log(data);
        this.updateMap(data.map);
      }
    }.bind(this));

    props.socket.on('update tourney', function(data) {
      if (this.mounted) {
        console.log(data);
        this.updateMap(data.map);
      }
    }.bind(this));
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateMap(newMap) {
    this.setState({map: newMap});
  }

  updateTile(row, col, type, title, info, highlight) {
    let copy = this.state.map.slice();
    copy[row][col] = [type, title, info, highlight];
    this.setState({map: copy, menu: copy[row][col]});
    this.props.socket.emit("map tile", {id: this.id, row: row, col: col, type: type, title: title, info: info, highlight: highlight});
  }

  handleDrop(e) {
    e.preventDefault();
    let r1 = parseInt(e.dataTransfer.getData("row"));
    let c1 = parseInt(e.dataTransfer.getData("col"));
    let r2 = e.target.getAttribute("data-row");
    let c2 = e.target.getAttribute("data-col");
    let temp = this.state.map[r1][c1];
    let copy = this.state.map.slice();
    copy[r1][c1] = copy[r2][c2];
    copy[r2][c2] = temp;
    this.updateMap(copy);
    let vals = this.state.map[r2][c2];
    this.setState({map: copy, menu: vals, row: r2, col: c2});
    console.log("switched!");
    this.props.socket.emit("map switch", {id: this.id, a: r1, b: c1, c: r2, d:c2});
  }

  handleClick(e) {
    let row = e.target.getAttribute("data-row");
    let col = e.target.getAttribute("data-col");
    if (row != null && col != null) {
      let vals = this.state.map[row][col];
      this.setState({menu: vals, row: row, col: col});
    }
  }

  render() {
    return (
      <div className="tourney">
        <Menu name={this.id} type={this.state.menu[0]} socket={this.props.socket}
          title={this.state.menu[1]} info={this.state.menu[2]} highlight={this.state.menu[3]}
            row={this.state.row} col={this.state.col} updateTile={this.updateTile} />
        <div>
          <Map crow={this.state.row} ccol={this.state.col} name={this.id}
            socket={this.props.socket} map={this.state.map}
              handleDrop={this.handleDrop} handleClick={this.handleClick} />
        </div>
      </div>
    )
  }
}

export default Tourney;
