import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

import {ChatContext, ChatContextProvider} from './ChatContextProvider';

const useStyles = makeStyles({
    chatSection: {
      width: '100%',
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
});

export default function Dashboard() {
    const classes = useStyles();

    return (
        <div>
            <ChatContextProvider>
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid item xs={3} className={classes.borderRight500}>
                        <Divider />
                        <Forms />
                    </Grid>
                    <ChatBox />
                </Grid>
            </ChatContextProvider>
        </div>
    );
}


// NOTE: with ChatContext.Consumer we can do functional approach too!
class Header extends React.Component {
    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { activeFormState } = context;
                const [ activeForm ] = activeFormState;
                return (
                    <Grid container>
                        <Grid item xs={12} >
                            <Typography variant="h5" className="header-message">{activeForm}</Typography>
                        </Grid>
                    </Grid>
                );
            }}</ChatContext.Consumer>
        )
    }
}


class Forms extends React.Component {
    addForm(state, newform) {
        const newstate = {
            ...state,
            [newform]: [

            ]
        }
        return newstate;
    }

    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { classes, allStringsState, activeFormState } = context;
                const [ activeForm, changeActiveForm ] = activeFormState;
                const [ allStrings, changeAllStrings ] = allStringsState;

                const allForms = Object.keys(allStrings);

                return (
                    <div>
                        <Divider />
                        <List>
                            {allForms.map((form) =>
                                <ListItem
                                    button
                                    className={form == activeForm ? classes.activeForm : 'null'}
                                    onClick={(e) => changeActiveForm(e.target.innerText)}
                                    key={form}>
                                    <ListItemText primary={form}>
                                        {form}
                                    </ListItemText>
                                </ListItem>
                            )}
                            <Button onClick={() => {
                                const newFormTitle = '@F' + Math.random(100).toFixed(2) * 100;
                                const newStrings = {
                                    ...allStrings,
                                    [newFormTitle]: [

                                    ]
                                };
                                changeAllStrings(newStrings);
                            }}>
                                <AddIcon color="primary"/>
                            </Button>
                        </List>
                    </div>
                );
            }}</ChatContext.Consumer>
        );
    }
}


class ChatBox extends React.Component {
    render() {
        return (
            <Grid item xs={9}>
                <TextFields />
                <Divider />
            </Grid>
        )
    }
}


class TextFields extends React.Component {
    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { classes, allStringsState, fieldCountState, activeFormState } = context;
                const [ fieldCount, setFieldCount ] = fieldCountState;
                const [ activeForm, changeActiveForm ] = activeFormState;
                const [ allStrings, changeAllStrings ] = allStringsState;
                return (
                    <div>
                        <List className={classes.messageArea}>
                            <ListItem>
                                <Grid container style={{padding: '20px'}}>
                                    {allStrings[activeForm].map((str) =>
                                        <Grid item xs={11}>
                                            <TextField
                                                id="outlined-basic-email"
                                                label={str.content}
                                                value={str.content}
                                                fullWidth />
                                            <Button onClick={() => setFieldCount(fieldCount + 1)}>
                                                <CancelIcon/>
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </ListItem>
                        </List>
                        <Button onClick={() => {
                            const newStrings = {
                                ...allStrings,
                                [activeForm]: [
                                    ...allStrings[activeForm],
                                    {id: Date.now(), content: 'hello'}
                                ]
                            };
                            changeAllStrings(newStrings);
                        }}>
                            <AddIcon color="primary"/>
                        </Button>
                    </div>
                );
            }}</ChatContext.Consumer>
        );
    }
}

