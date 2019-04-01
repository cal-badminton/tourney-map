import React from 'react';
import Tile from './Tile.js';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.createRow = this.createRow.bind(this);
  }

  createRow() {
    let tiles = []
    let row = this.props.row;
    let map = this.props.map;
    for (let i = 0; i < 18; i++) {
      tiles.push(<Tile key={i} crow={this.props.crow} ccol={this.props.ccol}
        name={this.props.name} socket={this.props.socket}
          row={row} col={i} type={map[row][i][0]} title={map[row][i][1]}
            info={map[row][i][2]} highlight={map[row][i][3]}
            click={this.props.handleClick} drop={this.props.handleDrop} />);
    }
    return tiles;
  }

  render() {
    return (
      <div className="grid-row">
        {this.createRow()}
      </div>
    )
  }
}

export default Row;
