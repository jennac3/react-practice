import React, { Component, useState } from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function Todo() {
    const [textInput, changeTextInput] = useState('');
    const [todos, setTodos] = useState([{'text': 'Buy orange', id: Date.now()}]);

    return (
        <div className="App">
        <h1>TODO Application</h1>

        <form onSubmit={(e) => {
            e.preventDefault();
            if (textInput === '') return
            setTodos([...todos, {id: Date.now(), text: textInput}]);
            e.target.reset();
        }}>
            <input
            type='text'
            placeholder='Your TODO'
            onChange={(e) => {
                e.preventDefault();
                changeTextInput(e.target.value);
            }}
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
                    key={todo.text}>
                    <ListItemText primary={todo.text}>
                        {todo.text}
                    </ListItemText>

                    <Button onClick={(e) => {
                        setTodos(todos.filter((t) => t.id != todo.id))
                    }}>remove</Button>
                    
                    <Button>mark as complete</Button>
                </ListItem>
            )}
            </List>
        </ul>
        </div>
    );
}