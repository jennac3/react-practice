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
import InputLabel from '@material-ui/core/InputLabel';
import ReactJson from 'react-json-view';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { green } from '@material-ui/core/colors';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import fileDownload from 'js-file-download';
import SaveIcon from '@material-ui/icons/Save';
import DescriptionIcon from '@material-ui/icons/Description';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InputBase from '@material-ui/core/InputBase';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

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
                const { classes, formDataState, activeFormState, editedFormState, newFormNameState } = context;
                const [ formData, setFormData ] = formDataState;
                const [ activeForm, setActiveForm ] = activeFormState;
                const [ editedForm, setEditedForm ] = editedFormState;
                const [ newFormName, setNewFormName ] = newFormNameState;

                const allForms = Object.keys(formData);

                return (
                    <div className={classes.formsArea} style={{width: '100%'}}>
                        <Header></Header>
                        <List>
                            <div>
                                {allForms.map((form) =>
                                    <div>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText>
                                                {editedForm == form
                                                    ?
                                                    <TextField
                                                        id="outlined-full-width"
                                                        margin="normal"
                                                        defaultValue={form}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(e) => {
                                                            /*const newFormTitle = e.target.value;
                                                            const newFormData = {
                                                                ...formData,
                                                                [newFormTitle]: [
                                                                    {"id": Date.now(), "widget-type": "hello"}
                                                                ]
                                                            };
                                                            setFormData(newFormData);*/
                                                            setNewFormName(e.target.value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <Button>
                                                                    <SaveIcon onClick={() => {
                                                                        setEditedForm(null);
                                                                    }}/>
                                                                </Button>
                                                            )
                                                        }}
                                                    />
                                                    :
                                                    <div>
                                                        {form}
                                                        <Button onClick={() => setEditedForm(form)}>
                                                            <EditIcon/>
                                                        </Button>
                                                    </div>
                                                }
                                            </ListItemText>
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="comments">
                                                    {activeForm == form
                                                        ?
                                                        <ExpandLessIcon onClick={() => {
                                                            setActiveForm(null);
                                                        }}/>
                                                        :
                                                        <ExpandMoreIcon onClick={() => {
                                                            setActiveForm(form);
                                                        }}/>
                                                    }
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem alignItems="flex-start">
                                            {activeForm === form &&
                                                <TextFields form={form} />
                                            }
                                        </ListItem>
                                    </div>
                                )}
                            </div>
                        </List>
                        <Button
                            variant="contained"
                            color="action"
                            onClick={() => {
                                const newFormTitle = '@F' + Math.random(1000).toFixed(2) * 1000;
                                const newFormData = {
                                    ...formData,
                                    [newFormTitle]: [
                                        {
                                            "id": Date.now(),
                                            "widget-type": "",
                                            "widget-attributes": {

                                            }
                                        }
                                    ]
                                };
                                setFormData(newFormData);
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
            const { classes, formDataState } = context;
            const [ formData, setFormData ] = formDataState;

            const addWidget = () => {
                const newFormData = {
                    ...formData,
                    [form]: [
                        ...formData[form],
                        {
                            "id": Date.now(),
                            "widget-type": "",
                            "widget-attributes": {
                                
                            }
                        }
                    ]
                };
                setFormData(newFormData);
            }

            const changeWidget = (formId, widgetType) => {
                const newFormData = {...formData};
                newFormData[form].forEach((s) => {
                    if(s.id == formId){
                        s["widget-type"] = widgetType;
                        // TODO replace hardcoding
                        if (widgetType == "radio-group") {
                            s["widget-attributes"] = {
                                "layout": "",
                                "default": "",
                            }
                        } else if (widgetType == "select") {
                            s["widget-attributes"] = {
                                "default": "",
                            }
                        }
                    } 
                });
                setFormData(newFormData);
            }

            return (
                <Grid container style={{padding: '20px', border: '1px solid #e0e0e0', margin: '10px'}}>
                    <List>
                        {formData[form].map((eachFormData, index) =>
                            <div>
                            <ListItem>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-age-native-simple">Widget Type</InputLabel>
                                    <Select
                                        native
                                        label="Age"
                                        inputProps={{
                                            name: 'age',
                                            id: 'outlined-age-native-simple',
                                        }}
                                        value={eachFormData["widget-type"]}
                                        onChange={(e) => {
                                            changeWidget(eachFormData.id, e.target.value);
                                        }}
                                        >
                                        <option aria-label="None" value="" />
                                        <option value={"radio-group"}>radio-group</option>
                                        <option value={"select"}>select</option>
                                    </Select>
                                </FormControl>
                            </ListItem>
                            <ListItem>
                                <WidgetField form={form} formIndex={index} />
                            </ListItem>
                            <Divider />
                            </div>
                        )}
                        <Button variant="contained" color="action" onClick={() => addWidget()}>
                            <AddIcon />
                        </Button>
                    </List>
                </Grid>
            );
        }}</JsonSyncContext.Consumer>
    );
}

export function WidgetField(props) {
    return (
        <JsonSyncContext.Consumer>{(context) => {
            const { form, formIndex } = props;

            //alert(JSON.stringify(form));
            const { classes, formDataState } = context;
            const [ formData, setFormData ] = formDataState;

            const widgetType = formData[form][formIndex]["widget-type"];

            const onReorderClick = (index, newIndex) => {
                const newFormData = formData[form];
                if (newIndex < 0 || newIndex >= newFormData.length) return;
                // swap values
                const swapVal = newFormData[index];
                newFormData[index] = newFormData[newIndex];
                newFormData[newIndex] = swapVal;

                console.log(JSON.stringify({
                    ...formData,
                    [form]: newFormData
                }));

                console.log(JSON.stringify(newFormData));

                setFormData({
                    ...formData,
                    [form]: newFormData
                });
            }

            return (
                <ListItem alignItems="flex-start">
                    <WidgetAttributesField form={form} formIndex={formIndex} widgetType={widgetType}/>
                </ListItem>
            );
        }}</JsonSyncContext.Consumer>
    );
}

export function WidgetAttributesField(props) {
    return (
        <JsonSyncContext.Consumer>{(context) => {
            const { widgetType, form, formIndex } = props;
            return (
                {
                    "radio-group": (
                    <div>
                        <WidgetTextField asking={"layout"} form={form} formIndex={formIndex}/>
                        <WidgetTextField asking={"default"} form={form} formIndex={formIndex}/>
                        <WidgetOptionsField asking={"default"} form={form} formIndex={formIndex} />
                    </div>
                    ),
                    "select": (
                    <div>
                        <WidgetTextField asking={"values"} form={form} formIndex={formIndex}/>
                        <WidgetOptionsField asking={"default"} form={form} formIndex={formIndex} />
                    </div>
                    ),
                }[widgetType]
            );
        }}</JsonSyncContext.Consumer>
    );
}

class WidgetTextField extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { asking, form, formIndex } = this.props;
    
                const { classes, formDataState } = context;
                const [ formData, setFormData ] = formDataState;

                const changeWidgetAttributes = (newAttributeVal) => {
                    const newFormData = {
                        ...formData,
                    };
                    newFormData[form][formIndex]["widget-attributes"][asking] = newAttributeVal;
                    setFormData(newFormData);
                }

                return (
                    <div>
                        <TextField
                            id="outlined-full-width"
                            value={formData[form][formIndex]["widget-attributes"][asking]}
                            onChange={(e) => changeWidgetAttributes(e.target.value)}
                            placeholder={asking}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            />
                    </div>
                );
            }}</JsonSyncContext.Consumer>
        );
    }
}

export function WidgetOptionsField(props) {
    return (
        <JsonSyncContext.Consumer>{(context) => {
            const { asking } = props;
            return (
                <div>
                </div>
            );
        }}</JsonSyncContext.Consumer>
    );
}

class JsonResults extends React.Component {
    render() {
        return (
            <JsonSyncContext.Consumer>{(context) => {
                const { classes, jsonEditorCodeState, jsonStatusState, formDataState } = context;
                const [ jsonEditorCode, setJsonEditorCode ] = jsonEditorCodeState;
                const [ jsonStatus ] = jsonStatusState;
                const [ formData, setFormData ] = formDataState;

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
                                    <Grid container direction="row" alignItems="center">
                                        <Grid item>
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
                                                            setFormData(JSON.parse(jsonCode));
                                                            console.log("jsoncode2", jsonCode);
                                                        };
                                                        console.log("jsoncode", jsonCode);
                                                    }
                                                }}
                                            />
                                            <DescriptionIcon style={{ marginRight: "5px" }}/>
                                        </Grid>
                                        <Grid item>
                                            Upload
                                        </Grid>
                                    </Grid>
                                </Button>
                                
                                <Button variant="contained"
                                        color="primary"
                                        style={{ display: 'inline-block', margin: '5px' }}
                                        onClick={() => fileDownload(jsonEditorCode, "sample.json")}>
                                    <Grid container direction="row" alignItems="center">
                                        <Grid item>
                                            <SaveAltIcon style={{ marginRight: "5px" }}/>
                                        </Grid>
                                        <Grid item>
                                            Download
                                        </Grid>
                                    </Grid>
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

