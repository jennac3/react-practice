import React, { createContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    messageArea: {
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'scroll'
    },
    jsonResultsArea: {
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'scroll',
    },
    activeForm: {
      borderRadius: "1em",
      backgroundColor: "#F6F6E8 !important",
    },
});

export const JsonSyncContext = createContext();

export function JsonSyncContextProvider(props) {
    const classes = useStyles();

    // local state
    const stringsOfStringsDataState = useState({
      '@F123': [
          {id: '010', content: 'a'},
          {id: '011', content: 'b'},
          {id: '012', content: 'c'},
      ],
      '@F301': [
          {id: '922', content: ''}
      ],
    });
    const [ stringsOfStringsData, setStringsOfStringsData ] = stringsOfStringsDataState;

    const jsonEditorCodeState = useState(JSON.stringify(stringsOfStringsData, undefined, 4));
    const [ jsonEditorCode, setJsonEditorCode ] = jsonEditorCodeState;

    const forms = Object.keys(stringsOfStringsData);
    const activeFormState = useState(forms[0]);

    const formDataState = useState([[]]);

    const jsonStatusState = useState("green");
    const [ jsonStatus, setJsonStatus ] = jsonStatusState;

    const hasJsonEditorCodeChanged = useCompare(jsonEditorCode);
    const hasstringsOfStringsDataChanged = useCompare(stringsOfStringsData);
    React.useEffect(() => {
      if (hasJsonEditorCodeChanged) {
        try {
          const jsonObject = JSON.parse(jsonEditorCode);
          setStringsOfStringsData(jsonObject);
          setJsonStatus("green");
        } catch (e) {
          setJsonStatus("red");
        }
        console.log("jsonEditorCode has changed");
      }
      if (hasstringsOfStringsDataChanged) {
        console.log("stringsOfStringsData has changed");
        setJsonEditorCode(JSON.stringify(stringsOfStringsData, undefined, 4));
      }
    }, [jsonEditorCode, stringsOfStringsData]);

    const state = {
        classes,
        stringsOfStringsDataState,
        activeFormState,
        formDataState,
        jsonEditorCodeState,
        jsonStatusState,
    };

    return (
        <JsonSyncContext.Provider value={{...state}}>
            {props.children}
        </JsonSyncContext.Provider>
    );
}

const useCompare = (val) => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}