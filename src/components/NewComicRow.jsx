import React, { Component } from 'react';
import { Icon } from "rsuite";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


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
            this.props.onTitleChange(this.props.id, pub[0].title);
            this.props.onPublisherChange(this.props.id, pub[0].publisher);
        }
        else {
            this.setState({title: e.target.value});
            this.setState({publisher: ""});
            this.props.onTitleChange(this.props.id, e.target.value);
            this.props.onPublisherChange(this.props.id, "");
        }
    }

    handlePublisherSelect = (e) => {
        console.log(this.props.id + "-" + e.target.value);
        console.log(this.state);

        this.props.onPublisherChange(this.props.id, e.target.value);
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
                <td>
                    <Autocomplete
                        onSelect={this.handleTitleSelect}
                        freeSolo
                        options={titles}
                        renderInput={(params) => (
                            <TextField {...params} label="Title" margin="normal" variant="outlined" />
                        )}
                    />
                </td>
                <td><TextField label="Volume" margin="normal" variant="outlined" onChange={this.handleVolumeChange} /></td>
                <td><TextField label="Issue" margin="normal" variant="outlined" onChange={this.handleIssueChange} /></td>
                <td><TextField label="Notes" margin="normal" variant="outlined" onChange={this.handleNoteChange} /></td>
                <td>
                    <Autocomplete
                        onSelect={this.handlePublisherSelect}
                        freeSolo
                        value={this.state.publisher}
                        onChange={(event, newValue) => {
                            console.log("change: ", newValue);
                            this.setState({publisher: newValue});
                          }}
                        inputValue={this.state.publisherInput}
                        onInputChange={(event, newInputValue) => {
                            console.log("input change: ", newInputValue);
                            this.setState({publisherInput: newInputValue});
                          }}
                        options={publishers}
                        renderInput={(params) => (
                            <TextField {...params} label="Publisher" margin="normal" variant="outlined" />
                        )}
                    />
                </td>
                <td><TextField label="Price Paid" margin="normal" variant="outlined" onChange={this.handlePricePaidChange} /></td>
            </tr>
        );
    }
}

export default NewComicRow;
