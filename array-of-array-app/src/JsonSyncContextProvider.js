import React, { createContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    formsArea: {
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
    const formDataState = useState({
      "Basic": [
        {
            "id": Date.now(),
            "widget-type": "radio-group",
            "widget-attributes": {
              "layout": "",
              "default": "",
            }
        }
      ],
      "Credentials": [
      ],
      "Advanced": [
      ],
      "Column Names Normalization": [
          //{id: '922', widgetType: 'radio-group'}
      ],
    });
    const [ formData, setFormData ] = formDataState;

    const jsonEditorCodeState = useState(JSON.stringify(formData, undefined, 4));
    const [ jsonEditorCode, setJsonEditorCode ] = jsonEditorCodeState;

    const forms = Object.keys(formData);

    //const formDataState = useState([[]]);

    const jsonStatusState = useState("green");
    const [ jsonStatus, setJsonStatus ] = jsonStatusState;

    const hasJsonEditorCodeChanged = useCompare(jsonEditorCode);
    const hasformDataChanged = useCompare(formData);

    const activeFormState = React.useState(forms[0]);

    const editedFormState = React.useState(null); // [form_title_being_edited, new_form_title]
    const newFormNameState = React.useState(null);
    const [ editedForm, setEditedForm ] = editedFormState;
    const [ newFormName, setNewFormName ] = newFormNameState;

    const oldFormName = usePrevious(editedForm); 

    React.useEffect(() => {
      if (hasJsonEditorCodeChanged) {
        try {
          const jsonObject = JSON.parse(jsonEditorCode);
          setFormData(jsonObject);
          setJsonStatus("green");
        } catch (e) {
          setJsonStatus("red");
        }
        console.log("jsonEditorCode has changed");
      }
      if (hasformDataChanged) {
        console.log("formData has changed");
        setJsonEditorCode(JSON.stringify(formData, undefined, 4));
      }
    }, [jsonEditorCode, formData]);

    /*React.useEffect(() => { 
      if (editedForm == null && newFormName != null) { // form title's edit has been finished.
        // old name -> oldFormName
        // new name -> newFormName
        //if (oldFormName !== newFormName) {
          const newSOSData = {
            ...formData,
            [newFormName]: [
              {"id": Date.now(), "widgetType": "hello"}
            ]
          }
          delete newSOSData[oldFormName]; 
          setFormData(newSOSData);
        }
        const newObject = {};
        delete Object.assign(newObject, formData, {[newFormName]: formData[oldFormName] })[oldFormName];
        setFormData(newObject);
      }
    }, [editedForm]);*/

    const state = {
        classes,
        formDataState,
        jsonEditorCodeState,
        jsonStatusState,
        activeFormState,
        editedFormState,
        newFormNameState,
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