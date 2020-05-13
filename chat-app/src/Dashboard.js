import React, { useState } from 'react';
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
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import {CTX} from './Store';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
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


export default function Dashboard() {
    const classes = useStyles();
    // CTX store
    const {allChats, sendChatAction, user} = React.useContext(CTX);
    const channels = Object.keys(allChats);

    // local state
    const [textInput, changeTextInputValue] = useState('');
    const [searchInput, changeSearchInputValue] = useState('');
    const [activeChannel, changeActiveChannel] = useState(channels[0]);

    console.log("update");
    return (
        <div>
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">{activeChannel}</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem
                        button
                        key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt="Jenna Choi" src="https://s.clipartkey.com/mpngs/s/273-2739524_chimmy-bts-chimmy.png" />
                        </ListItemIcon>
                        <ListItemText primary="Jenna Choi"></ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField
                        id="outlined-basic-email" label="Search" variant="outlined"
                        value={searchInput}
                        onChange={(e) => changeSearchInputValue(e.target.value)}
                        fullWidth />
                </Grid>
                <Divider />
                <List>
                    {channels.filter((channel) => channel.includes(searchInput)).map((channel) =>
                        <ListItem
                            button
                            className={channel == activeChannel ? classes.activeChannel : null}
                            onClick={(e) => changeActiveChannel(e.target.innerText)}
                            key={channel}>
                            <ListItemText primary={channel}>
                                {channel}
                            </ListItemText>
                        </ListItem>
                    )}
                </List>
            </Grid>
            <Grid item xs={9}>
                <List className={classes.messageArea}>
                    {allChats[activeChannel].map((msg) =>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="right" primary={msg.msg}></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="right" secondary={msg.timestamp}></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )}
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField
                            id="outlined-basic-email"
                            label="Type Something"
                            value={textInput}
                            onKeyDown={(e) => {
                                if(e.key === "Enter" || e.which == 13 || e.keyCode == 13){
                                    sendChatAction({
                                        msg: textInput,
                                        from: user,
                                        channel: activeChannel,
                                        timestamp: new Date().getHours() + ":" + new Date().getMinutes()});
                                    changeTextInputValue('');
                                }
                            }}
                            onChange={(e) => changeTextInputValue(e.target.value)}
                            fullWidth />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary" aria-label="add"><SendIcon /></Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
    );
}