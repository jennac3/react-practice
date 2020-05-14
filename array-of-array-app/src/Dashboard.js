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
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid container xs={2} className={classes.borderRight500}>
                        <Divider />
                        <FormsList />
                    </Grid>
                    <Grid container className={classes.fitScreen} xs={10}>
                        <Grid item xs={7} className={classes.borderRight500}>
                            <Divider />
                            <TextFields />
                        </Grid>
                        <Grid item xs={5}>
                            <JsonResults />
                        </Grid>
                    </Grid>
                </Grid>
            </JsonSyncContextProvider>
        </div>
    );
}


// NOTE: with JsonSyncContext.Consumer we can do functional approach too!
class Header extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { activeFormState } = context;
                const [ activeForm ] = activeFormState;
                return (
                    <Grid container>
                        <Grid item xs={12} >
                            <Typography variant="h5" className="header-message">{activeForm}</Typography>
                        </Grid>
                    </Grid>
                );
            }}</JsonSyncContext.Consumer>
        )
    }
}


class FormsList extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { classes, stringsOfStringsDataState, activeFormState } = context;
                const [ activeForm, changeActiveForm ] = activeFormState;
                const [ stringsOfStringsData, setStringsOfStringsData ] = stringsOfStringsDataState;

                const allForms = Object.keys(stringsOfStringsData);

                return (
                    <div style={{width: '100%'}}>
                        <List>
                            <ListItem button key="RemySharp">
                                <ListItemIcon>
                                    <Avatar alt="Avatar" src="https://icons.iconarchive.com/icons/papirus-team/papirus-mimetypes/512/app-json-icon.png" />
                                </ListItemIcon>
                                <ListItemText primary="JSON syncer"></ListItemText>
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            {allForms.map((form) =>
                                <ListItem
                                    className={form == activeForm ? classes.activeForm : 'null'}
                                    button
                                    onClick={(e) => changeActiveForm(e.target.innerText)}
                                    key={form}>
                                    <ListItemText primary={form}>
                                        {form}
                                    </ListItemText>
                                </ListItem>
                            )}
                            <Button
                                variant="contained"
                                color="action"
                                onClick={() => {
                                    const newFormTitle = '@F' + Math.random(1000).toFixed(2) * 1000;
                                    const newStrings = {
                                        ...stringsOfStringsData,
                                        [newFormTitle]: [
                                        ]
                                    };
                                    setStringsOfStringsData(newStrings);
                                }}>
                                <AddIcon/>
                            </Button>
                        </List>
                    </div>
                );
            }}</JsonSyncContext.Consumer>
        );
    }
}


class TextFields extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { classes, stringsOfStringsDataState, activeFormState } = context;
                const [ activeForm ] = activeFormState;
                const [ stringsOfStringsData, setStringsOfStringsData ] = stringsOfStringsDataState;
                return (
                    <div className={classes.messageArea}>
                        <Grid container style={{padding: '20px'}}>
                            {stringsOfStringsData[activeForm].map((str) =>
                                <TextField
                                    id="outlined-full-width"
                                    label={"label"}
                                    value={str.content}
                                    onChange={(e) => {
                                        const newStrings = {...stringsOfStringsData};
                                        newStrings[activeForm].forEach((s) => {
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
                                        endAdornment: <Button onClick={() => {
                                                                const newStrings = {
                                                                    ...stringsOfStringsData,
                                                                    [activeForm]: stringsOfStringsData[activeForm].filter((s) => s.id != str.id)
                                                                };
                                                                setStringsOfStringsData(newStrings);
                                                            }}>
                                                            <CancelIcon/>
                                                        </Button>
                                    }}
                                    variant="outlined"
                                    />
                            )}
                        </Grid>
                        <Button variant="contained" color="action" onClick={() => {
                            const newStrings = {
                                ...stringsOfStringsData,
                                [activeForm]: [
                                    ...stringsOfStringsData[activeForm],
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

