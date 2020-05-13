import React, { Component, useState } from 'react';
import Todo from './Todo';

class App extends Component {
  /*onSubmit = (event) => {
    event.preventDefault();
    if(this.state.input === '') return;
    this.setState((prevState) => {
      return { 
        todos: prevState.todos.concat(this.state.input) 
      };
    });
    this.setState({input: ''});
  }*/

  render() {
    return (
      <div><Todo/></div>
    );
  }
}

export default App;