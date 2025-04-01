import React, { Component } from 'react';
import { Icon } from "rsuite";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tooltip from "@material-ui/core/Tooltip";
import { MAX_TITLE_LENGTH } from '../store/constants';


class NewComicRow extends Component {
    constructor(props) {
		super(props);

        this.state = {
            title:"", 
            titleInput:"",
            volume:0, 
            issueNum:0, 
            notes:[], 
            publisher:"", 
            publisherInput:"", 
            pricePaid:0.0,
            titleList:this.props.titlePubMap.titleData.flatMap(t => t.title).sort((a, b) => a.toUpperCase() > b.toUpperCase() ? 1 : -1),
            publisherList:this.props.titlePubMap.publishers.sort((a, b) => a.toUpperCase() > b.toUpperCase() ? 1 : -1)
        }
	}

    getPublishersForTitle(title) {
        const entry = this.props.titlePubMap.titleData.filter(item => item.title.toUpperCase() === title);
        console.log("entry", entry);
        return entry.length === 0 ? undefined : entry[0];
    }

    handleTitleSelectEvent = (e) => {
        this.handleTitleSelect(e.target.value)
    }

    handleTitleSelect = (title) => {
        console.log("handleTitleSelect:" + this.props.id + "-" + title);

        const titleData = this.getPublishersForTitle(title.toUpperCase())
        if(titleData !== undefined) {
            this.setState({title: title});
            this.setState({publisher: titleData.publishers[0]});
            this.setState({volume: titleData.volume});
            this.props.onTitleChange(this.props.id, title, title.length <= MAX_TITLE_LENGTH);
            this.props.onPublisherChange(this.props.id, titleData.publishers[0], this.validatePublisher(titleData.publishers[0]));
            this.props.onVolumeChange(this.props.id, titleData.volume);
        }
        else {
            this.setState({title: title});
            this.props.onTitleChange(this.props.id, title, title.length <= MAX_TITLE_LENGTH);
        }
    }

    handlePublisherSelect = (e) => {
        console.log("handlePublisherSelect -" + this.props.id + "-" + e.target.value);
        console.log(this.state);

        this.props.onPublisherChange(this.props.id, e.target.value, this.validatePublisher(e.target.value));
    }

    handleVolumeChange = (e) => {
        console.log(this.props.id + "-" + e.target.value);
        console.log(this.state);

        this.setState({volume: e.target.value});
        this.props.onVolumeChange(this.props.id, +e.target.value);
    }

    handleIssueChange = (e) => {
        console.log(this.props.id + "-" + e.target.value);
        console.log(this.state);

        this.setState({issueNum: e.target.value});
        this.props.onIssueChange(this.props.id, +e.target.value);
    }

    handleNoteChange = (e) => {
        console.log(this.props.id + "-" + e.target.value);
        console.log(this.state);

        var notesArr = e.target.value.split(";");
        notesArr.map((note, i)=>{
            notesArr[i] = {notes: note};
        });

        this.props.onNoteChange(this.props.id, notesArr);
    }

    handlePricePaidChange = (e) => {
        console.log(this.props.id + "-" + e.target.value);
        //Need validation here
        this.setState({pricePaid: +e.target.value});
        console.log(this.state);
        this.props.onPricePaidChange(this.props.id, +e.target.value);
    }

    validatePublisher = (publisher) => {
        console.log("Validating publisher: " + publisher);
        return publisher !== null && publisher !== undefined && publisher.length > 0;
    }

    isNewTitle = () => {
        return this.state.title !== null && 
                this.state.title !== undefined && 
                this.state.title.length > 0 && 
                !this.state.titleList.includes(this.state.title);

    }

    render() {
        var removeButton = <button onClick={() => this.props.onDelete(this.props.id)}
                                    type="submit">
                                    <Icon icon="minus" />Remove
                            </button>;

        console.log(this.props)

        return (
            <tr>
                <td>{removeButton}</td>
                <td style={{ backgroundColor: this.state.title.length > MAX_TITLE_LENGTH ? 'lightcoral': this.isNewTitle() ? 'lightgreen':''}}>
                    <Tooltip
                        title={"Title length must be " + MAX_TITLE_LENGTH + " characters or less."}
                        placement="top"
                        arrow
                        open={this.state.title.length > MAX_TITLE_LENGTH}
                    >        
                        <Autocomplete
                            onSelect={this.handleTitleSelectEvent}
                            inputValue={this.state.titleInput}
                            onChange={(event, newValue) => {
                                this.setState({title: newValue});
                                this.handleTitleSelect(newValue);
                              }}
                            onInputChange={(event, newInputValue) => {
                                this.setState({titleInput: newInputValue});
                                this.handleTitleSelect(newInputValue);
                          }}
                            freeSolo
                            options={this.state.titleList}
                            renderInput={(params) => (
                                <TextField {...params} label="Title" margin="normal" variant="outlined" />
                            )}
                        />
                    </Tooltip>
                </td>
                <td><TextField label="Volume" style={{width:"100%"}} value={this.state.volume} margin="normal" variant="outlined" onChange={this.handleVolumeChange} /></td>
                <td><TextField label="Issue" style={{width:"100%"}} margin="normal" variant="outlined" onChange={this.handleIssueChange} /></td>
                <td><TextField label="Notes" style={{width:"100%"}} margin="normal" variant="outlined" onChange={this.handleNoteChange} /></td>
                <td style={{ backgroundColor: !this.validatePublisher(this.state.publisher) && !this.validatePublisher(this.state.publisherInput) ? 'lightcoral': ''}}>
                <Tooltip
                        title={"Publisher must be present."}
                        placement="top"
                        arrow
                        open={!this.validatePublisher(this.state.publisher) && !this.validatePublisher(this.state.publisherInput)}
                    >
                    <Autocomplete
                        onSelect={this.handlePublisherSelect}
                        freeSolo
                        value={this.state.publisher}
                        onChange={(event, newValue) => {
                            this.setState({publisher: newValue});
                            this.props.onPublisherChange(this.props.id, newValue, this.validatePublisher(newValue));
                          }}
                        inputValue={this.state.publisherInput}
                        onInputChange={(event, newInputValue) => {
                            this.setState({publisherInput: newInputValue});
                            this.props.onPublisherChange(this.props.id, newInputValue, this.validatePublisher(newInputValue));
                          }}
                        options={this.state.publisherList}
                        renderInput={(params) => (
                            <TextField {...params} label="Publisher" margin="normal" variant="outlined" />
                        )}
                    />
                    </Tooltip>
                </td>
                <td><TextField label="Price Paid" style={{width:"100%"}} margin="normal" variant="outlined" onChange={this.handlePricePaidChange} /></td>
            </tr>
        );
    }
}

export default NewComicRow;
