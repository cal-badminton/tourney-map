import React from 'react';
import Row from './Row.js'

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = props.map;
    this.createRows = this.createRows.bind(this);
  }

  createRows() {
    let rows = []
    for (let i = 0; i < 10; i++) {
      rows.push(<Row key={i} crow={this.props.crow} ccol={this.props.ccol}
        name={this.props.name} socket={this.props.socket}
          handleClick={this.props.handleClick} handleDrop={this.props.handleDrop}
            map={this.props.map} row={i} />);
    }
    return rows;
  }

  render() {
    return (
      <div className="tourney-display">
        <div className="tourney-grid">
          {this.createRows()}
        </div>
      </div>
    )
  }
}

export default Map
