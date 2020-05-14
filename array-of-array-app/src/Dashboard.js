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
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import ReactJson from 'react-json-view';
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

import {AOAContext, AOAContextProvider} from './AOAContextProvider';

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
            <AOAContextProvider>
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid container xs={1} className={classes.borderRight500}>
                        <Divider />
                        <Forms />
                    </Grid>
                    <Grid container className={classes.fitScreen} xs={11}>
                        <Grid item xs={6} className={classes.borderRight500}>
                            <Divider />
                            <TextFields />
                        </Grid>
                        <Grid item xs={6}>
                            <Results />
                        </Grid>
                    </Grid>
                </Grid>
            </AOAContextProvider>
        </div>
    );
}


// NOTE: with AOAContext.Consumer we can do functional approach too!
class Header extends React.Component {
    render() {
        return (
            <AOAContext.Consumer>{(context) => {
                const { activeFormState } = context;
                const [ activeForm ] = activeFormState;
                return (
                    <Grid container>
                        <Grid item xs={12} >
                            <Typography variant="h5" className="header-message">{activeForm}</Typography>
                        </Grid>
                    </Grid>
                );
            }}</AOAContext.Consumer>
        )
    }
}


class Forms extends React.Component {
    render() {
        return (
            <AOAContext.Consumer>{(context) => {
                const { classes, allStringsState, activeFormState } = context;
                const [ activeForm, changeActiveForm ] = activeFormState;
                const [ allStrings, setAllStrings ] = allStringsState;

                const allForms = Object.keys(allStrings);

                return (
                    <div>
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
                                color="primary"
                                onClick={() => {
                                    const newFormTitle = '@F' + Math.random(1000).toFixed(2) * 1000;
                                    const newStrings = {
                                        ...allStrings,
                                        [newFormTitle]: [
                                        ]
                                    };
                                    setAllStrings(newStrings);
                                }}>
                                <AddIcon/>
                            </Button>
                        </List>
                    </div>
                );
            }}</AOAContext.Consumer>
        );
    }
}


class TextFields extends React.Component {
    render() {
        return (
            <AOAContext.Consumer>{(context) => {
                const { classes, allStringsState, activeFormState } = context;
                const [ activeForm, changeActiveForm ] = activeFormState;
                const [ allStrings, setAllStrings ] = allStringsState;
                return (
                    <div className={classes.messageArea}>
                        <Grid container style={{padding: '20px'}}>
                            {allStrings[activeForm].map((str) =>
                                <TextField
                                    id="outlined-full-width"
                                    label={"label"}
                                    value={str.content}
                                    onChange={(e) => {
                                        const newStrings = {...allStrings};
                                        newStrings[activeForm].forEach((s) => {
                                            if(s.id == str.id){
                                                s.content = e.target.value;
                                            }            
                                        });
                                        setAllStrings(newStrings);
                                    }}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <Button onClick={() => {
                                                                const newStrings = {
                                                                    ...allStrings,
                                                                    [activeForm]: allStrings[activeForm].filter((s) => s.id != str.id)
                                                                };
                                                                setAllStrings(newStrings);
                                                            }}>
                                                            <CancelIcon/>
                                                        </Button>
                                    }}
                                    variant="outlined"
                                    />
                            )}
                        </Grid>
                        <Button variant="contained" color="primary" onClick={() => {
                            const newStrings = {
                                ...allStrings,
                                [activeForm]: [
                                    ...allStrings[activeForm],
                                    {id: Date.now(), content: ''}
                                ]
                            };
                            setAllStrings(newStrings);
                        }}>
                            <AddIcon />
                        </Button>
                    </div>
                );
            }}</AOAContext.Consumer>
        );
    }
}

class Results extends React.Component {
    render() {
        return (
            <AOAContext.Consumer>{(context) => {
                const { classes, allStringsState, jsonEditorCodeState, jsonCopiedState, jsonStatusState } = context;
                const [ allStrings, setAllStrings ] = allStringsState;
                const [ jsonEditorCode, setJsonEditorCode ] = jsonEditorCodeState;
                const [ jsonCopied, setJsonCopied ] = jsonCopiedState;
                //const [count, setCount] = countState;
                //const [message, setMessage] = messageState;
                const [ jsonStatus, setJsonStatus ] = jsonStatusState;

                return (
                    <div className={classes.resultsArea}>
                        <div style={{ backgroundColor: "#e0e0e0", display: "flex"}}>
                            <div style={{ textAlign: "left", alignItems: "center" }}>
                                Status: {jsonStatus == "green"
                                    ? <CheckCircleIcon style={{ color: green[500] }} />
                                    : <ErrorIcon color="secondary"/>
                                }
                            </div>
    
                            <div style={{ textAlign: "right" }}>
                                <CopyToClipboard
                                    text={jsonEditorCode}
                                    onCopy={() => setJsonCopied(true)}>
                                    <Button>
                                        <FileCopyIcon></FileCopyIcon>
                                        {jsonCopied ? "Copied!" : "Copy JSON to Clipboard"}
                                    </Button>
                                </CopyToClipboard>
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
            }}</AOAContext.Consumer>
        );
    }
}

