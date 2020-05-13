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

// HELPFUL STUFF I LEARNED: when hook get updated, it rerenders function
export default function Store(props) {
    const [allChats, dispatch] = React.useReducer(reducer, {
        '#general': [
            {from: 'jenna', msg: 'hi', timestamp:"12:00"}
        ],
        '#fun': [
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
        <CTX.Provider value={{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}