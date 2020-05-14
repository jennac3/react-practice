import React from 'react';
import io from 'socket.io-client';

export const CTX = React.createContext();

/*
    msg {
        from: 'user'
        msg: 'hi'
        channel: 'general'
    }

    state {
        general: [
            msg, msg, msg
        ]
        fun: [
            msg, msg, msg
        ]
    }
*/

function reducer(state, action) {
    //const {from, msg, channel, timestamp} = action.payload;
    switch(action.type) {
        /*case "RECEIVE_MESSAGE":
            console.log(state);
            const newstate = {
                ...state,
                [channel]: [
                    ...state[channel],
                    {from, msg, timestamp}
                ]
            }
            console.log(newstate);
            return newstate;
        */
        case "ADD_FORM":
            const {newform} = action.payload;
            const newstate = {
                ...state,
                [newform]: [

                ]
            }
            return newstate;
        default:
            return state
    }
}

let socket;

/*function sendChatAction(value) {
    socket.emit('chat message', value);
}*/

function addForm(value) {
    //dispatch({type: 'ADD_FROM', payload: {newform: value}})
}

// HELPFUL STUFF I LEARNED: when hook get updated, it rerenders function
export default function Store(props) {
    const [allStrings, dispatch] = React.useReducer(reducer, {
        '@F1': [
            {id: 1, content: 'hello'}
        ],
        '@F2': [
            {id: 2, content: 'hello'}
        ]
    });

    // HELPFUL STUFF I LEARNED:
    // We should useEffect to make sure the following socket gets initialized
    // only ONCE. Otherwise, this code may run multiple times.
    // Let it run ONLY when the component is mounted.
    React.useEffect(() => {
        // do this only once, when the component is mounted
        if (!socket) {
            socket = io(':3001');
    
            socket.on('chat message', function(msg) {
                dispatch({type: 'RECEIVE_MESSAGE', payload: msg})
            });
        }
    });

    //const user = 'user' + Math.random(100).toFixed(2);
    const user = "jenna";

    return (
        <CTX.Provider value={{allStrings, addForm, user}}>
            {props.children}
        </CTX.Provider>
    )
}