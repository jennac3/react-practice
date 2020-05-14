import React, { createContext, useState } from 'react';
import { CTX } from './Store';
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
    activeForm: {
      borderRadius: "1em",
      backgroundColor: "#F6F6E8 !important",
    },
});

export const ChatContext = createContext();

export function ChatContextProvider(props) {
    const classes = useStyles();

    // CTX store
    // const {allStrings, addForm, user} = React.useContext(CTX);
    const allStringsState = useState({
      '@F_sample1': [
          {id: 1, content: 'hello'}
      ],
      '@F_sample2': [
          {id: 2, content: 'hello'}
      ]
    });

    const [ allStrings, changeAllStrings ] = allStringsState;
    const forms = Object.keys(allStrings);

    // local state
    const textInputState = useState('');
    const activeFormState = useState(forms[0]);

    const formDataState = useState([[]]);

    const formCountState = useState(0);
    const fieldCountState = useState(0);

    const state = {
        classes,
        allStringsState,
        textInputState, 
        activeFormState,
        formCountState,
        fieldCountState,
        formDataState,
    };


    return (
        <ChatContext.Provider value={{...state}}>
            {props.children}
        </ChatContext.Provider>
    );
}