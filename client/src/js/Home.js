import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createName: '',
      createPassword: '',
      manageName: '',
      managePassword: ''
    }
    this.updateCreateName = this.updateCreateName.bind(this);
    this.updateCreatePassword = this.updateCreatePassword.bind(this);
    this.updateManageName = this.updateManageName.bind(this);
    this.updateManagePassword = this.updateManagePassword.bind(this);
    this.createTourney = this.createTourney.bind(this);
    this.manageTourney = this.manageTourney.bind(this);
    this.manageEnter = this.manageEnter.bind(this);
    this.createEnter = this.createEnter.bind(this);

    props.socket.on('tourney', function(data) {
      props.history.push('/tourneymap/tourney/' + data);
    })
  }

  updateCreateName(event) {
    this.setState({createName: event.target.value});
    console.log(this.state);
  }

  updateCreatePassword(event) {
    this.setState({createPassword: event.target.value});
    console.log(this.state);
  }

  updateManageName(event) {
    this.setState({manageName: event.target.value});
    console.log(this.state);
  }

  updateManagePassword(event) {
    this.setState({managePassword: event.target.value});
    console.log(this.state);
  }

  createTourney() {
    if (this.state.createName === '' || this.state.createPassword === '') {
      alert('Fill in all fields!');
    } else {
      this.props.socket.emit('create tourney',
        {name: this.state.createName, password: this.state.createPassword});
    }
  }

  manageTourney() {
    if (this.state.manageName === '' || this.state.managePassword === '') {
      alert('Fill in all fields!');
    } else {
      this.props.socket.emit('manage tourney',
        {name: this.state.manageName, password: this.state.managePassword});
    }
  }

  manageEnter(event) {
    if (event.key == "Enter")
      this.manageTourney();
  }

  createEnter(event) {
    if (event.key == "Enter")
      this.createTourney();
  }

  render() {
    return (
      <div className="home">
        <div className="home-box">
          <p className="home-title">{"Tourney Map"}</p>
          <div className="home-create">
            <p className="home-text">Name:</p>
            <input className="home-input" type="text" onInput={this.updateCreateName} />
            <p className="home-text">Password:</p>
            <input className="home-input" type="password" onInput={this.updateCreatePassword}
              onKeyPress={this.createEnter}/>
            <button className="home-create-button" onClick={this.createTourney}> Create Tourney </button>
          </div>
          <div className="home-manage">
            <p className="home-text">Name:</p>
            <input className="home-input" type="text" onInput={this.updateManageName} />
            <p className="home-text">Password:</p>
            <input className="home-input" type="password" onInput={this.updateManagePassword}
              onKeyPress={this.manageEnter}/>
            <button className="home-manage-button" onClick={this.manageTourney}> Manage Tourney </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
