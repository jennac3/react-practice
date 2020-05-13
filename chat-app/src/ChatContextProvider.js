import React, { createContext, Component, useState } from 'react';
import {CTX} from './Store';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    messageArea: {
      height: '70vh',
      overflowY: 'auto'
    },
    activeChannel: {
      borderRadius: "1em",
      backgroundColor: "#F6F6E8 !important",
    },
});

export const ChatContext = createContext();

export function ChatContextProvider(props) {
    const classes = useStyles();

    // CTX store
    const {allChats, sendChatAction, user} = React.useContext(CTX);
    const channels = Object.keys(allChats);

    // local state
    const textInputState = useState('');
    const searchInputState = useState('');
    const activeChannelState = useState(channels[0]);

    const state = {
        classes,
        allChats, sendChatAction, user,
        textInputState, 
        searchInputState,
        activeChannelState,
    };

    return (
        <ChatContext.Provider value={{...state}}>
            {props.children}
        </ChatContext.Provider>
    );
}