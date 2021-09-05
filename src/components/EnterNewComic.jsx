import React, { Component } from 'react';
import store from "../store/Store";
import NavigationBar from './NavigationBar';
import Table from 'react-bootstrap/Table';
import { Icon } from "rsuite";
import NewComicRow from './NewComicRow';
import { getTitlesAndPublishers, addComicList } from '../services/comicsService';
import "../css/EnterNewComic.css"
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddComicsModal from './AddComicsModal';

class EnterNewComic extends Component {
    constructor(props) {
		super(props);

		this.state = { showModal: false, comicRows: [], comics: [], titlePublishers:[], isLoading: true, currentIndex: 1, pricePaidTotal: 0.0 };
	}

    componentDidMount() {
        this.setState({isLoading: true});
        var {jwt} = store.getState().user;
        getTitlesAndPublishers(jwt).then(
                (titlesAndPublishers)=>{
                    this.setState({isLoading: false});
                    this.setState({titlePublishers: titlesAndPublishers});
                }
            );
	}

    handleAddClick = () => {
        console.log("handleAddClick");
        var rows = this.state.comicRows;
        rows.push(<NewComicRow key={this.state.currentIndex} id={this.state.currentIndex}
             titlesList={this.state.titlePublishers}
             onDelete={this.handleRemoveClick}
             onTitleChange={this.handleTitleChange}
             onPublisherChange={this.handlePublisherChange}
             onVolumeChange={this.handleVolumeChange}
             onIssueChange={this.handleIssueChange}
             onPricePaidChange={this.handlePricePaidChange}
             onNoteChange={this.handleNoteChange}
             />);

        var comics = this.state.comics;
        comics.push({id: this.state.currentIndex,
            pricePaid: 0.0
        });

        this.setState({ comicRows: rows });
        this.setState({currentIndex: this.state.currentIndex + 1});
    }

    handleClearClick = () => {
        this.setState({ comicRows: [] });
        this.setState({ comics: [] });
        this.setState({pricePaidTotal: 0.0});
    }

    handleRemoveClick = (rowId) => {
        console.log("handleRemoveClick", rowId);
        console.log(this.state.comicRows);
        console.log(this.state.comics);

        const rows = this.state.comicRows.filter(r => r.props.id !== rowId);
        console.log(rows);
        this.setState({ comicRows: rows });

        const comicsCopy = this.state.comics.filter(r => r.id !== rowId);
        console.log(comicsCopy);
        this.setState({ comics: comicsCopy });

        this.updateTotalPricePaid(comicsCopy);
    }

    handleAddComicList = () => {
        var {jwt} = store.getState().user;
        //addComicList(jwt,this.state.comics);

        this.setState({ showModal: true });
    }

    handleSortListClick = () => {
        var comicsCopy = [...this.state.comics];
        comicsCopy.sort(function (a, b) {
            return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
            || a.volume > b.volume ? 1 : a.volume < b.volume ? -1 : 0 
            || a.issue > b.issue ? 1 : a.issue < b.issue ? -1 : 0;
        });

        var comicRowCopy = [];
        var index;
        comicsCopy.map((c) => {
            index = this.state.comicRows.findIndex((cr) => parseInt(cr.key, 10) === c.id);
            comicRowCopy.push(this.state.comicRows[index]);
        });

        this.setState({ comics: comicsCopy });
        this.setState({ comicRows: comicRowCopy });
    }

    handleTitleChange = (rowId, title) => {
        console.log("handleTitleChange: " + rowId + " " + title);
        var comicsCopy = [...this.state.comics];
        var index = comicsCopy.findIndex((c) => c.id === rowId);

        var comicToUpdate = this.state.comics[index];
        comicToUpdate.title = title;
        comicsCopy[index] = comicToUpdate;

        this.setState({ comics: comicsCopy });
    }

    handlePublisherChange = (rowId, publisher) => {
        console.log("handlePublisherChange: " + rowId + " " + publisher);
        var comicsCopy = [...this.state.comics];
        var index = comicsCopy.findIndex((c) => c.id === rowId);

        var comicToUpdate = this.state.comics[index];
        comicToUpdate.publisher = publisher;
        comicsCopy[index] = comicToUpdate;

        this.setState({ comics: comicsCopy });
    }

    handleVolumeChange = (rowId, volume) => {
        console.log("handleVolumeChange: " + rowId + " $" + volume);
        var comicsCopy = [...this.state.comics];
        var index = comicsCopy.findIndex((c) => c.id === rowId);

        var comicToUpdate = this.state.comics[index];
        comicToUpdate.volume = volume;
        comicsCopy[index] = comicToUpdate;

        this.setState({ comics: comicsCopy });
    }

    handleIssueChange = (rowId, issue) => {
        console.log("handleIssueChange: " + rowId + " $" + issue);
        var comicsCopy = [...this.state.comics];
        var index = comicsCopy.findIndex((c) => c.id === rowId);

        var comicToUpdate = this.state.comics[index];
        comicToUpdate.issue = issue;
        comicsCopy[index] = comicToUpdate;

        this.setState({ comics: comicsCopy });
    }

    handlePricePaidChange = (rowId, pricePaid) => {
        console.log("handlePricePaidChange: " + rowId + " $" + pricePaid);
        var comicsCopy = [...this.state.comics];
        var index = comicsCopy.findIndex((c) => c.id === rowId);

        var comicToUpdate = this.state.comics[index];
        comicToUpdate.pricePaid = pricePaid;
        comicsCopy[index] = comicToUpdate;

        this.setState({ comics: comicsCopy });
        this.updateTotalPricePaid(comicsCopy);
    }

    handleNoteChange = (rowId, notesArr) => {
        console.log("rowId: ", rowId);
        console.log("notesArr: ", notesArr);

        var comicsCopy = [...this.state.comics];
        var index = comicsCopy.findIndex((c) => c.id === rowId);

        var comicToUpdate = this.state.comics[index];
        comicToUpdate.notes = notesArr;
        comicsCopy[index] = comicToUpdate;

        this.setState({ comics: comicsCopy });

    }

    updateTotalPricePaid = (comics) => {
        console.log("updateTotalPricePaid: ", comics);
        var pricePaidSum = comics.reduce((a, v) => a = a + v.pricePaid, 0);

        console.log(pricePaidSum);
        this.setState({ pricePaidTotal: pricePaidSum });
    }

    hideModal = () => {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div>
                <NavigationBar history={this.props.history}/>
                <Table size="sm" striped bordered hover>
                    <thead>
                        <tr>
                            <th className="emptyHeader"></th>
                            <th className="titleHeader">Title</th>
                            <th className="numberHeader">Volume</th>
                            <th className="numberHeader">Issue Number</th>
                            <th>Notes</th>
                            <th className="publisherHeader">Publisher</th>
                            <th className="numberHeader">Price Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.comicRows}
                    </tbody>
                </Table>
                <div className="topButtonPanel">
                    <button onClick={this.handleAddClick}
					    	type="submit"
						    className="btn navBarButton"
                            style={{float:"left"}}
				    >
					    <Icon icon="plus-square-o" /> Add Row
				    </button>
                    <button onClick={this.handleSortListClick}
					    	type="submit"
						    className="btn navBarButton"
                            style={{float:"left"}}
				    >
					    <Icon icon="sort" /> Sort List
				    </button>
                    <button onClick={this.handleClearClick}
					    	type="submit"
						    className="btn navBarButton"
                            style={{float:"right"}}
				    >
					    <Icon icon="minus-square-o" /> Clear
				    </button>
                </div>
                <div className="bottomButtonPanel">
                    <button onClick={this.handleAddComicList}
					    	type="submit"
						    className="btn navBarButton"
				    >
					    <Icon icon="plus" /> Add comic list
				    </button>

                    Total Comics to be added: {this.state.comicRows.length}: ${this.state.pricePaidTotal.toFixed(2)}
                </div>
                <AddComicsModal showModal={this.state.showModal} onHide={this.hideModal} onSuccessfulAdd={this.handleClearClick} comicsList={this.state.comics}/>
            </div>
        );
    }
}

export default EnterNewComic;
