import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import ReactJson from 'react-json-view';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import fileDownload from 'js-file-download';
import DescriptionIcon from '@material-ui/icons/Description';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {JsonSyncContext, JsonSyncContextProvider} from './JsonSyncContextProvider';

const useStyles = makeStyles({
    chatSection: {
      width: '100%',
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    fitScreen: {
        minHeight: '100vh',
        maxHeight: '100vh',
    },
});

export default function Dashboard() {
    const classes = useStyles();

    return (
        <div>
            <JsonSyncContextProvider>
                <Header/>
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid container className={classes.fitScreen}>
                        <Grid item xs={6} className={classes.borderRight500}>
                            <Divider />
                            <FormsList />
                        </Grid>
                        <Grid item xs={6}>
                            <JsonResults />
                        </Grid>
                    </Grid>
                </Grid>
            </JsonSyncContextProvider>
        </div>
    );
}

class Header extends React.Component {
    render() {
        return (
            <div>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                            <Avatar alt="Avatar" src="https://icons.iconarchive.com/icons/papirus-team/papirus-mimetypes/512/app-json-icon.png" />
                        </ListItemIcon>
                        <ListItemText primary="JSON syncer"></ListItemText>
                    </ListItem>
                </List>
                <Divider />
            </div>
        )
    }
}


class FormsList extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { classes, stringsOfStringsDataState, activeFormState } = context;
                const [ stringsOfStringsData, setStringsOfStringsData ] = stringsOfStringsDataState;
                const [ activeForm, setActiveForm ] = activeFormState;

                const allForms = Object.keys(stringsOfStringsData);

                return (
                    <div className={classes.formsArea} style={{width: '100%'}}>
                        <List>
                            {allForms.map((form) =>
                                <ListItem
                                    key={form}>
                                    <ListItemText>
                                        <ToggleButton
                                            style={{width: '100%'}}
                                            value="check"
                                            selected={activeForm == form}
                                            onChange={() => {
                                                if (activeForm == form) {
                                                    setActiveForm(null);
                                                } else {
                                                    setActiveForm(form);
                                                }
                                            }}
                                            >
                                            {form}
                                        </ToggleButton>
                                        {activeForm === form &&
                                            <TextFields form={form} />
                                        }
                                    </ListItemText>
                                </ListItem>
                            )}
                        </List>
                        <Button
                            variant="contained"
                            color="action"
                            onClick={() => {
                                const newFormTitle = '@F' + Math.random(1000).toFixed(2) * 1000;
                                const newStrings = {
                                    ...stringsOfStringsData,
                                    [newFormTitle]: [
                                        {"id": Date.now(), "content": "hello"}
                                    ]
                                };
                                setStringsOfStringsData(newStrings);
                                setActiveForm(newFormTitle);
                            }}>
                            <AddIcon/>
                        </Button>
                    </div>
                );
            }}</JsonSyncContext.Consumer>
        );
    }
}


export function TextFields(props) {
    return (
        <JsonSyncContext.Consumer>{(context) => {
            const { form } = props;
            //alert(JSON.stringify(form));
            const { classes, stringsOfStringsDataState } = context;
            const [ stringsOfStringsData, setStringsOfStringsData ] = stringsOfStringsDataState;

            const onReorderClick = (index, newIndex) => {
                const newStringsData = stringsOfStringsData[form];
                if (newIndex < 0 || newIndex >= newStringsData.length) return;
                // swap values
                const swapVal = newStringsData[index];
                newStringsData[index] = newStringsData[newIndex];
                newStringsData[newIndex] = swapVal;

                console.log(JSON.stringify({
                    ...stringsOfStringsData,
                    [form]: newStringsData
                }));

                console.log(JSON.stringify(newStringsData));

                setStringsOfStringsData({
                    ...stringsOfStringsData,
                    [form]: newStringsData
                });
            }

            return (
                <div>
                    <Grid container style={{padding: '20px'}}>
                        {stringsOfStringsData[form].map((str, index) =>
                            <TextField
                                id="outlined-full-width"
                                value={str.content}
                                onChange={(e) => {
                                    const newStrings = {...stringsOfStringsData};
                                    newStrings[form].forEach((s) => {
                                        if(s.id == str.id){
                                            s.content = e.target.value;
                                        }            
                                    });
                                    setStringsOfStringsData(newStrings);
                                }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                                            <Button onClick={() => onReorderClick(index, index - 1)}
                                                    disabled={index == 0}>
                                                <ArrowUpwardIcon/>
                                            </Button>
                                            <Button onClick={() => onReorderClick(index, index + 1)}
                                                    disabled={index == stringsOfStringsData[form].length-1}>
                                                <ArrowDownwardIcon/>
                                            </Button>
                                            <Button onClick={() => {
                                                    const newStrings = {
                                                        ...stringsOfStringsData,
                                                        [form]: stringsOfStringsData[form].filter((s) => s.id != str.id)
                                                    };
                                                    setStringsOfStringsData(newStrings);
                                                }}>
                                                <CancelIcon/>
                                            </Button>
                                        </ButtonGroup>
                                    )
                                }}
                                variant="outlined"
                                />
                        )}
                    </Grid>
                    <Button variant="contained" color="action" onClick={() => {
                        const newStrings = {
                            ...stringsOfStringsData,
                            [form]: [
                                ...stringsOfStringsData[form],
                                {id: Date.now(), content: ''}
                            ]
                        };
                        setStringsOfStringsData(newStrings);
                    }}>
                        <AddIcon />
                    </Button>
                </div>
            );
        }}</JsonSyncContext.Consumer>
    );
}

class JsonResults extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { classes, jsonEditorCodeState, jsonStatusState, stringsOfStringsDataState } = context;
                const [ jsonEditorCode, setJsonEditorCode ] = jsonEditorCodeState;
                const [ jsonStatus ] = jsonStatusState;
                const [ stringsOfStringsData, setStringsOfStringsData ] = stringsOfStringsDataState;

                return (
                    <div className={classes.jsonResultsArea}>
                        <div style={{ padding: "10px", backgroundColor: "#e0e0e0", display: "flex", verticalAlign: "middle"}}>
                            <div style={{ position: "relative", left: '3%', verticalAlign: "middle" }}>
                                JSON STATUS: {jsonStatus == "green"
                                    ? <CheckCircleIcon style={{ color: green[500] }} />
                                    : <ErrorIcon color="secondary"/>
                                }
                            </div>
    

                            <div style={{ position: 'absolute', right: '0%', bottom: '0%', verticalAlign: "middle" }}>
                                <Button variant="contained"
                                        component="label"
                                        color="primary"
                                        style={{ display: 'inline-block', margin: '5px' }}>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files.length > 0) {
                                                const reader = new FileReader();
                                                reader.readAsText(files[0]);
                                                let jsonCode;
                                                reader.onload = r => {
                                                    jsonCode = r.target.result;
                                                    setStringsOfStringsData(JSON.parse(jsonCode));
                                                    console.log("jsoncode2", jsonCode);
                                                };
                                                console.log("jsoncode", jsonCode);
                                            }
                                        }}
                                    />
                                    <DescriptionIcon style={{ marginRight: "5px" }}/>
                                </Button>
                                <Button variant="contained"
                                        color="primary"
                                        style={{ display: 'inline-block', margin: '5px' }}
                                        onClick={() => fileDownload(jsonEditorCode, "sample.json")}>
                                    <SaveAltIcon style={{ marginRight: "5px" }}/>
                                </Button>
                            </div>
                        </div>
                        <Divider/>
                        <Grid container>
                            <Editor
                                value={jsonEditorCode}
                                highlight={code => highlight(code, languages.js)}
                                onValueChange={(code) => {
                                    setJsonEditorCode(code);
                                }}
                                padding={10}
                                style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                                }}
                            />
                        </Grid>
                    </div>
                );
            }}</JsonSyncContext.Consumer>
        );
    }
}

