import React, { Component, useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function Todo() {
    const [textInput, changeTextInput] = useState([]);
    const [todos, setTodos] = useState(['hmm']);

    return (
        <div className="App">
        <h1>TODO Application</h1>

        <form>
            <h1>Hello~</h1>
            <p>Enter your TODO list, and submit:</p>
            <input
            type='text'
            placeholder='Enter TODO'
            value={textInput}
            onKeyDown={(e) => {
                if(e.key === "Enter" || e.which == 13 || e.keyCode == 13){
                    setTodos([todos, e.target.value]);
                    changeTextInput('');
                }
            }}
            onChange={(e) => changeTextInput(e.target.value)}
            />
            <button type="submit">
                add
            </button>
        </form>

        <ul>
            <List>
            {todos.map((todo, index) =>
                <ListItem
                    button
                    key={todo}>
                    <ListItemText primary={todo}>
                        {index} - {todo}
                    </ListItemText>
                </ListItem>
            )}
            </List>
        </ul>
        </div>
    );
}