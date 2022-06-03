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
            volume:0, 
            issueNum:0, 
            notes:[], 
            publisher:"", 
            publisherInput:"", 
            pricePaid:0.0
        }
	}

    handleTitleSelect = (e) => {
        console.log("handleTitleSelect:" + this.props.id + "-" + e.target.value);
        console.log(this.state);

        const pub = this.props.titlesList.filter(comic => comic.title.toUpperCase() === e.target.value.toUpperCase());
        if(pub.length !== 0) {
            console.log(pub);

            this.setState({title: pub[0].title});
            this.setState({publisher: pub[0].publisher});
            this.setState({volume: pub[0].volume});
            this.props.onTitleChange(this.props.id, pub[0].title, pub[0].title.length <= MAX_TITLE_LENGTH);
            this.props.onPublisherChange(this.props.id, pub[0].publisher, this.validatePublisher(pub[0].publisher));
            this.props.onVolumeChange(this.props.id, pub[0].volume);
        }
        else {
            this.setState({title: e.target.value});
            this.props.onTitleChange(this.props.id, e.target.value, e.target.value.length <= MAX_TITLE_LENGTH);
            //this.props.onPublisherChange(this.props.id, "");
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
        return publisher !== null && publisher !== undefined && publisher.length > 0;
    }

    render() {
        var removeButton = <button onClick={() => this.props.onDelete(this.props.id)}
                                    type="submit">
                                    <Icon icon="minus" />Remove
                            </button>;

        const titles = [...new Set(this.props.titlesList.sort((a, b) => a.title > b.title ? 1 : -1).map((a) => a.title))];
        const publishers = [...new Set(this.props.titlesList.sort((a, b) => a.publisher > b.publisher ? 1 : -1).map((a) => a.publisher))];

        return (
            <tr>
                <td>{removeButton}</td>
                <td style={{ backgroundColor: this.state.title.length > MAX_TITLE_LENGTH ? 'lightcoral': ''}}>
                    <Tooltip
                        title={"Title length must be " + MAX_TITLE_LENGTH + " characters or less."}
                        placement="top"
                        arrow
                        open={this.state.title.length > MAX_TITLE_LENGTH}
                    >        
                        <Autocomplete
                            onSelect={this.handleTitleSelect}
                            freeSolo
                            options={titles}
                            renderInput={(params) => (
                                <TextField {...params} label="Title" margin="normal" variant="outlined" />
                            )}
                        />
                    </Tooltip>
                </td>
                <td><TextField label="Volume" style={{width:"100%"}} value={this.state.volume} margin="normal" variant="outlined" onChange={this.handleVolumeChange} /></td>
                <td><TextField label="Issue" style={{width:"100%"}} margin="normal" variant="outlined" onChange={this.handleIssueChange} /></td>
                <td><TextField label="Notes" style={{width:"100%"}} margin="normal" variant="outlined" onChange={this.handleNoteChange} /></td>
                <td style={{ backgroundColor: !this.validatePublisher(this.state.publisher) ? 'lightcoral': ''}}>
                <Tooltip
                        title={"Publisher must be present."}
                        placement="top"
                        arrow
                        open={!this.validatePublisher(this.state.publisher)}
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
                        options={publishers}
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
