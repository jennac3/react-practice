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
    const {from, msg, channel, timestamp} = action.payload;
    switch(action.type) {
        case "RECEIVE_MESSAGE":
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
        default:
            return state
    }
}

let socket;

function sendChatAction(value) {
    socket.emit('chat message', value);
}

export default function Store(props) {
    const [allChats, dispatch] = React.useReducer(reducer, {
        '#general': [
        ],
        '#fun': [
            {from: 'jenna', msg: 'b1', timestamp:"09:30"},
            {from: 'jenna', msg: 'b2', timestamp:"09:30"},
            {from: 'jenna', msg: 'b3', timestamp:"09:30"},
        ]
    });

    if (!socket) {
        socket = io(':3001');

        socket.on('chat message', function(msg) {
            dispatch({type: 'RECEIVE_MESSAGE', payload: msg})
        });
    }

    //const user = 'user' + Math.random(100).toFixed(2);
    const user = "jenna";

    return (
        <CTX.Provider value={{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}