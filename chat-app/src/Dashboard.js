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
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';

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
                <Header />

                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid item xs={3} className={classes.borderRight500}>
                        <Profile />
                        <Divider />
                        <Channels />
                    </Grid>
                    <ChatBox />
                </Grid>
            </ChatContextProvider>
        </div>
    );
}

// VALID APPROACH # 1
/*class Header extends React.Component {
    static contextType = ChatContext;
    render() {
      const { activeChannelState } = this.context;
      const [ activeChannel ] = activeChannelState;
      console.log("activeChannel", activeChannel);
      return (
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">{activeChannel}</Typography>
            </Grid>
        </Grid>
      );
    }
  }*/

// VALID APPROACH # 2
// NOTE: with ChatContext.Consumer we can do functional approach too!
class Header extends React.Component {
    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { activeChannelState } = context;
                const [ activeChannel ] = activeChannelState;
                console.log("activeChannel", activeChannel);
                return (
                    <Grid container>
                        <Grid item xs={12} >
                            <Typography variant="h5" className="header-message">{activeChannel}</Typography>
                        </Grid>
                    </Grid>
                );
            }}</ChatContext.Consumer>
        )
    }
}

function Profile() {
    return (
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
    );
}

class Channels extends React.Component {
    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { classes, allChats, activeChannelState, searchInputState } = context;
                const [ activeChannel, changeActiveChannel ] = activeChannelState;
                const [ searchInput, changeSearchInputValue ] = searchInputState;
                const channels = Object.keys(allChats);
                return (
                    <div>
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
                <MessageHistory />
                <Divider />
                <MessageArea />
            </Grid>
        )
    }
}

class MessageHistory extends React.Component {
    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { classes, allChats, activeChannelState } = context;
                const [ activeChannel ] = activeChannelState;
                return (
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
                );
            }}</ChatContext.Consumer>
        );
    }
}

class MessageArea extends React.Component {
    render() {
        return (
            <ChatContext.Consumer>{(context) => {
                const { textInputState, sendChatAction, user, activeChannelState } = context;
                const [ textInput, changeTextInputValue ] = textInputState;
                const [ activeChannel ] = activeChannelState;
                return (
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
                );
            }}</ChatContext.Consumer>
        );
    }
}
