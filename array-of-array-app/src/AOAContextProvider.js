import React, { createContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    messageArea: {
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'scroll'
    },
    resultsArea: {
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'scroll',
    },
    activeForm: {
      borderRadius: "1em",
      backgroundColor: "#F6F6E8 !important",
    },
});

export const AOAContext = createContext();

export function AOAContextProvider(props) {
    const classes = useStyles();

    // CTX store
    // const {allStrings, addForm, user} = React.useContext(CTX);

    // local state
    const allStringsState = useState({
      '@F123': [
          {id: '010', content: ''}
      ],
      '@F301': [
          {id: '922', content: ''}
      ],
    });
    const [ allStrings, setAllStrings ] = allStringsState;
    const forms = Object.keys(allStrings);

    const jsonEditorCodeState = useState(JSON.stringify(allStrings, undefined, 4));
    const [ jsonEditorCode, setJsonEditorCode ] = jsonEditorCodeState;

    const activeFormState = useState(forms[0]);
    const formDataState = useState([[]]);

    /*const countState = useState(0);
    const messageState = useState("");

    const [count, setCount] = countState;
    const [message, setMessage] = messageState;

    const hasCountChanged = useCompare(count)
    const hasMessageChanged = useCompare(message);

    React.useEffect(() => {
      if (hasCountChanged) {
        console.log("count has changed");
        setMessage(`count is ${count}`)
      }
      if (hasMessageChanged) {
        console.log("message has changed");
      }
    }, [count, message]);*/

    const hasJsonEditorCodeChanged = useCompare(jsonEditorCode);
    const hasAllStringsChanged = useCompare(allStrings);

    const jsonCopiedState = useState(false);
    const [ jsonCopied, setJsonCopied ] = jsonCopiedState;

    const jsonStatusState = useState("green");
    const [ jsonStatus, setJsonStatus ] = jsonStatusState;

    React.useEffect(() => {
      if (hasJsonEditorCodeChanged) {
        setJsonCopied(false);
        try {
          const jsonObject = JSON.parse(jsonEditorCode);
          setAllStrings(jsonObject);
          setJsonStatus("green");
        } catch (e) {
          setJsonStatus("red");
        }
        console.log("jsonEditorCode has changed");
      }
      if (hasAllStringsChanged) {
        console.log("allStrings has changed");
        setJsonEditorCode(JSON.stringify(allStrings, undefined, 4));
      }
    }, [jsonEditorCode, allStrings]);

    const state = {
        classes,
        allStringsState,
        activeFormState,
        formDataState,
        jsonEditorCodeState,
        jsonCopiedState,
        jsonStatusState,
    };

    return (
        <AOAContext.Provider value={{...state}}>
            {props.children}
        </AOAContext.Provider>
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