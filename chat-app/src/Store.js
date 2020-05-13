import React from 'react';

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
    const {from, msg, channel} = action.payload;
    switch(action.type) {
        case "RECEIVE_MESSAGE":
            return {
                ...state,
                [channel]: [
                    ...state[channel],
                    {
                        from,
                        msg,
                        time: '00:00'
                    }
                ]
            }
        default:
            return state
    }
}

const initState = {
    '#general': [
        {from: 'jenna', msg: 'h1', timestamp:"09:30"},
        {from: 'jenna', msg: 'h2', timestamp:"09:30"},
        {from: 'jenna', msg: 'h3', timestamp:"09:30"},
    ],
    '#fun': [
        {from: 'jenna', msg: 'b1', timestamp:"09:30"},
        {from: 'jenna', msg: 'b2', timestamp:"09:30"},
        {from: 'jenna', msg: 'b3', timestamp:"09:30"},
    ]
}

export default function Store(props) {
    const reducerHook = React.useReducer(reducer, initState);

    return (
        <CTX.Provider value={reducerHook}>
            {props.children}
        </CTX.Provider>
    )
}