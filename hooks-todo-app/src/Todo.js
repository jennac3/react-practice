import React, { Component, useState } from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// HELPFUL STUFF I LEARNED:
// when component is mounted -> "other string"
// someprop change -> rerenders.
//                 -> "some string"
//                 -> but state doesn't get changed. It has the same value.
// because hooks won't be affected by rerendering

// stale closure: rare to encounter this


export default function Todo({someprop}) {
    const [textInput, changeTextInput] = useState('');
    const [todos, setTodos] = useState([{'text': 'Buy orange', id: Date.now()}]);

    let someVraible = 'some string';

    /*
    HELPFUL STUFF I LEARNED:

    React.useEffect(() => {
        // componentDidMount
        // executed when someprop changes
        someVraible = 'other string';

        // called closure
        return () => {
            // componentWillUnmount
        }
    }, []);*/

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
                        // filter is O(n) so splice, but it mutates an original array
                        setTodos(todos.filter((t) => t.id != todo.id))
                    }}>mark as complete</Button>
                </ListItem>
            )}
            </List>
        </ul>
        </div>
    );
}

/*
1. class based
    - rerenderred when:
        - setState
        - prop changes
2. funtional components
    - do not have states
    - rerenderred when:
        - prop changes
*/

// in Hooks, very limited lifecycle effects
// => useEffects

