import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      todos: []
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = (event) => {
    event.preventDefault();
    if(this.state.input === '') return;
    this.setState((prevState) => {
      return { 
        todos: prevState.todos.concat(this.state.input) 
      };
    });
    this.setState({input: ''});
  }

  render() {
    return (
      <div className="App">
        <h1>TODO Application</h1>

        <form onSubmit={this.onSubmit}>
          <h1>Hello~</h1>
          <p>Enter your TODO list, and submit:</p>
          <input
            type='text'
            placeholder='Enter TODO'
            value={this.state.input}
            onChange={(e) => this.setState({input: e.target.value})}
          />
          <button type="submit">add</button>
        </form>

        <ul>
          {this.state.todos.map((todo) =>
            <li>{todo}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;