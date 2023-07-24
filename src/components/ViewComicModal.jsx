import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ItemsCarousel from 'react-items-carousel';
import store from "../store/Store";
import Spinner from 'react-bootstrap/Spinner';
import { Icon } from "rsuite";
import { getOneIssue, getIssuesByTitle, updateComic, getDistinctTitles } from '../services/comicsService';
import { getTokenFromLocalStorage } from '../store/actions/jwtActions';
import { pic_url, DEFAULT_FILE_EXTENSION } from '../store/constants';
import { MAX_TITLE_LENGTH, MAX_INT_FIELD_LENGTH, MAX_PICTURE_NAME_LENGTH, MAX_NOTE_LENGTH, months, grades } from '../store/constants';
import { mobileCheck, doesPictureExist, parseDateStr } from '../services/Utilities';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';

function generatePictureFileName (title, volume, issue, notes) {
    var fileName;
    console.log(notes);
    if(notes[0] === undefined) {
        fileName = title + "_" + volume + "_" + issue;
    } else {
        fileName = title + "_" + volume + "_" + issue + "_" + notes[0].notes;
    }
    const charactersToRemoveRegex = /[.:',!]/g;
    const charactersToUnderScoreRegex = /[ /\\]/g;

    fileName = fileName.replace(charactersToRemoveRegex, '');
    fileName = fileName.replace(charactersToUnderScoreRegex, '_');
    fileName = fileName + DEFAULT_FILE_EXTENSION;
    
    return fileName;
}
  
class Viewcomicmodal extends Component {
    constructor(props) {
		super(props);

        console.log("inner width: ", window.innerWidth);
        console.log("store ", store.getState());
        console.log("publishers ", store.getState().data.publishers);
        this.state = {
            comic: null,
            displayComic: null,
            isLoading: false,
            noteInput: "",
            errors: false,
            errorMap: [],
            showModal: false,
            activeItemIndex: 0,
            unsavedChanges: false,
            validTitle: true,
            slides: [],
            titles:[],
            numCards: mobileCheck() ? 1 : 5
        }
	}
    
    resize() {
        this.setState({numCards: mobileCheck() <= 760 ? 1 : 5});
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
    }

    clickSlide = (comicID) => {
        console.log("Slide click: " + comicID);
        var localStorage = getTokenFromLocalStorage();
        if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            getOneIssue(comicID, localStorage).then(
                (res) => {
                    console.log("click slid issue: ", res);
                    this.setState({comic: {...res}});
                    if(!res.picture) {
                        res.picture = generatePictureFileName(res.title, res.volume, res.issue, res.notes);
                    }
                    this.setState({displayComic: {...res, deletedNotes:[]}});
                }
            );
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));

        if(this.props.comicID !== 0) {
            this.setState({ isLoading: true });
            var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            console.log("getting issue " + this.props.comicID);
            getOneIssue(this.props.comicID, localStorage).then(
                (res) => {
                    if(res.ok) {
                        console.log("initial: ", res);
                        this.setState({comic: {...res}});
                        if(!res.picture) {
                            res.picture = generatePictureFileName(res.title, res.volume, res.issue, res.notes);
                        }

                        this.setState({displayComic: {...res, deletedNotes:[]}});
                        this.populateSlides(res.title);
                    } else {
                        alert(res.message);
                    }
                }
            );

            getDistinctTitles(localStorage.jwt).then(
                    (titleList)=>{
                        this.setState({isLoading: false});
                        this.setState({titles: titleList});
                    }
                );

        }
        }
    }

    populateSlides = (queryTitle) => {
        var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            getIssuesByTitle(localStorage.jwt, queryTitle).then(
                (res)=>{
                        let slides = [];

                        res.comics.sort(function (a, b) {
                            a.notesSortStr = a.notes.length > 0 ? a.notes.map(({notes}) => notes).join(', ') : '';
                            b.notesSortStr = b.notes.length > 0 ? b.notes.map(({notes}) => notes).join(', ') : '';

                            return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
                            || a.volume > b.volume ? 1 : a.volume < b.volume ? -1 : 0
                            || a.issue > b.issue ? 1 : a.issue < b.issue ? -1 : 0
                            || a.notesSortStr > b.notesSortStr ? 1 : a.notesSortStr < b.notesSortStr ? -1 : 0;
                        });

                        res.comics.map((c)=>{slides.push(
                            <div>
                                <img key={Date.now()} src={pic_url + c.picture} alt={c.title + " " + c.volume + " " + c.issue}
                                height='425px' width='300px'/>
                                <br>
                                </br>
                                <text style={{color: 'blue'}}
                                    onClick={() => this.clickSlide(c.comicID)}>
                                    {c.title + " VOL: " + c.volume + " #" + c.issue}
                                </text>
                            </div>
                        )});
                        this.setState({slides: slides});
                        this.setState({ isLoading: false });
                        this.setState({ activeItemIndex: res.comics.findIndex(c => c.comicID === this.state.comic.comicID)});
                }
            );
        }
    }

    onHideClick = () => {
        console.log("Hiding modal...");
        if(this.state.unsavedChanges) {
            if(window.confirm("There are unsaved changes. Do you wish to discard them?")) {
                this.props.onHide();
            }
        } else {
            this.props.onHide();
        }
    }

    onSaveChangesClick = () => {
        var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            let comicToUpdate = {...this.state.displayComic};
            doesPictureExist(pic_url, comicToUpdate.picture).then((res)=>{
                console.log("image response: ", res);
                if(!res.ok) {
                    console.log(res.fullPath + " does not exist. File name will not be saved.");
                    comicToUpdate.picture = null;
                }

                console.log("Updating comic: ", comicToUpdate);
                updateComic(localStorage.jwt, comicToUpdate).then(
                    (res) => {

                        console.log("Update response: ", res);
                        if(res.ok) {
                            alert(res.message);

                            console.log("Update response: ", res);
                            if(this.state.comic.picture !== res.picture) {
                                this.populateSlides(res.title);
                            }

                            var dispComic = {...res};
                            if(!dispComic.picture) {
                                dispComic.picture = generatePictureFileName(res.title, res.volume, res.issue, res.notes);
                            }
                            this.setState({comic: {...res}});
                            this.setState({displayComic: {...dispComic, deletedNotes:[]}});
                            this.setState({unsavedChanges: false});
                        } else {
                            alert("Comic update failed.");
                        }
                    }
                );    
            });
        }
    }

    onTitleChange = (newTitle) => {
        var comicCopy = this.state.displayComic;
        comicCopy.title = newTitle;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
        this.setState({validTitle: newTitle.length <= MAX_TITLE_LENGTH});
    }

    onVolumeChange = (newVolume) => {
        var comicCopy = this.state.displayComic;
        comicCopy.volume = newVolume;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onIssueChange = (newIssue) => {
        var comicCopy = this.state.displayComic;
        comicCopy.issue = newIssue;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onPublicationDateChange = (newDateKey) => {
        var comicCopy = this.state.displayComic;
        var newPublicationDate = this.state.displayComic.year + newDateKey;
        
        let dateObj = parseDateStr(newPublicationDate);
        comicCopy.publicationDate = newPublicationDate;
        comicCopy.month = dateObj.month;
        comicCopy.day = dateObj.day;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onYearChange = (newYear) => {
        var comicCopy = this.state.displayComic;
        var newPublicationDate = newYear + "-" + this.state.displayComic.month + "-" + this.state.displayComic.day;

        comicCopy.publicationDate = newPublicationDate;
        comicCopy.year=newYear;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onStoryTitleChange = (newStoryTitle) => {
        var comicCopy = this.state.displayComic;
        comicCopy.storyTitle = newStoryTitle;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onPublisherChange = (newPublisher) => {
        var comicCopy = this.state.displayComic;
        comicCopy.publisher = newPublisher;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onPictureChange = (newPicture) => {
        var comicCopy = this.state.displayComic;
        comicCopy.picture = newPicture;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onPricePaidChange = (newPricePaid) => {
        var comicCopy = this.state.displayComic;
        comicCopy.pricePaid = newPricePaid;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onPricePaidBlur = () => {
        var comicCopy = this.state.displayComic;
        comicCopy.pricePaid = Number(this.state.displayComic.pricePaid).toFixed(2);

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onValueChange = (newValue) => {
        var comicCopy = this.state.displayComic;
        comicCopy.value = newValue;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onValueBlur = () => {
        var comicCopy = this.state.displayComic;
        comicCopy.value = Number(this.state.displayComic.value).toFixed(2);

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onNoteChange = (newNote) => {
        this.setState({noteInput: newNote});
        this.setState({unsavedChanges: true});
    }

    onGradeChange = (newGrade) => {
        var comicCopy = this.state.displayComic;
        comicCopy.condition = newGrade;

        this.setState({displayComic: comicCopy});
        this.setState({unsavedChanges: true});
    }

    onNoteSaveClick = (comicID) => {
        var comicCopy = this.state.displayComic;
        comicCopy.notes.push({comicID: comicID, noteID: 0, notes: this.state.noteInput});

        this.setState({displayComic: comicCopy});
        this.setState({noteInput: ""});
        this.setState({unsavedChanges: true});
    }

    onNoteDeleteClick = (noteID) => {
        const deletedNotes = this.state.displayComic.notes.filter(r => r.noteID === noteID);
        const notes = this.state.displayComic.notes.filter(r => r.noteID !== noteID);
        var comicCopy = this.state.displayComic;
        comicCopy.notes = notes;
        
        if(noteID !== 0) {
            comicCopy.deletedNotes = [...comicCopy.deletedNotes, ...deletedNotes];
            this.setState({unsavedChanges: true});
        }

        this.setState({displayComic: comicCopy});
    }

    render() {
        console.log(this.state.displayComic);
        if(this.state.comic == null || this.state.displayComic == null) {
            return(null);
        }

        var carousel;
        if(this.state.isLoading) {
            carousel = <Spinner animation="border" role="status"></Spinner>;
        }
        else if(this.state.slides.length > 1) {
            carousel = <ItemsCarousel
            infiniteLoop={false}
            gutter={12}
            activePosition={'center'}
            chevronWidth={60}
            disableSwipe={false}
            alwaysShowChevrons={false}
            numberOfCards={this.state.numCards}
            slidesToScroll={1}
            outsideChevron={false}
            showSlither={false}
            firstAndLastGutter={false}
            activeItemIndex={this.state.activeItemIndex}
            requestToChangeActive={value => this.setState({ activeItemIndex: value })}
            rightChevron={<Button>{'>'}</Button>}
            leftChevron={<Button>{'<'}</Button>}
          >
              {this.state.slides}
          </ItemsCarousel>;
        }

        return (
            <div>
                <Modal dialogClassName="modal-90w" style={{opacity:1}} show={this.props.showModal} onHide={this.props.onHide} backdrop="static" keyboard="false">
                <div className="scrollableModal">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.comic.title} VOL. {this.state.comic.volume} #{this.state.comic.issue}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {carousel}
                        </div>
                        <div className="container-50w-right">
                            <img key={Date.now()} src={pic_url + this.state.displayComic.picture}
			    	            alt={this.state.comic.title + " VOL: " + this.state.comic.volume + " #" + this.state.comic.issue}
                                className="img-center"/>
                        </div>
                        <div className="container-50w-left">
                            <Form>
                                <TextField disabled label="Comic ID" style={{width:"100%"}} value={this.state.comic.comicID} margin="normal" variant="outlined" InputProps={{readOnly: true}} />
                                <Autocomplete
                                    defaultValue={this.state.displayComic.title}
                                    onSelect={(e) => {this.onTitleChange(e.target.value)}}
                                    freeSolo
                                    options={this.state.titles}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            label="Title"
                                            margin="normal"
                                            variant="outlined"
                                            error={this.state.displayComic.title.length > MAX_TITLE_LENGTH}
                                            helperText={"Title must be " + MAX_TITLE_LENGTH + " characters or less."}
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {color: this.state.displayComic.title.length > MAX_TITLE_LENGTH ? 'red' :
                                                    this.state.comic.title === this.state.displayComic.title ? 'black' : 'green'}
                                        }}/>
                                    )}/>
                                <div>
                                    <TextField
                                        type='number'
                                        label="Volume" 
                                        value={this.state.displayComic.volume}
                                        onChange={(e) => this.onVolumeChange(e.target.value)}
                                        error={this.state.displayComic.volume > MAX_INT_FIELD_LENGTH}
                                        margin="normal" 
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.displayComic.volume > MAX_INT_FIELD_LENGTH ? 'red' :
                                                Number(this.state.comic.volume) === Number(this.state.displayComic.volume) ? 'black' : 'green'}
                                    }}/>
                                </div>
                                <div>
                                    <TextField
                                        type='number'
                                        label="Issue" 
                                        value={this.state.displayComic.issue}
                                        onChange={(e) => this.onIssueChange(e.target.value)}
                                        error={this.state.displayComic.issue > MAX_INT_FIELD_LENGTH}
                                        margin="normal" 
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.displayComic.issue > MAX_INT_FIELD_LENGTH ? 'red' :
                                                Number(this.state.comic.issue) === Number(this.state.displayComic.issue) ? 'black' : 'green'}
                                        }}/>
                                </div>
                                <TextField
                                    select
                                    label="Publication Month"
                                    margin="normal" 
                                    variant="outlined"
                                    style={{ marginRight: '10px' }}
                                    value={"-" + this.state.displayComic.month + "-" + this.state.displayComic.day}
                                    onChange={(e) => this.onPublicationDateChange(e.target.value)}
                                    InputProps={{
                                        style: {color: "-" + this.state.comic.month + "-" + this.state.comic.day === "-" + this.state.displayComic.month + "-" + this.state.displayComic.day ? 'black' : 'green',
                                            width: "25ch"
                                        }
                                    }}>
                                    {months.map((option) => (
                                        <MenuItem key={option.key} value={option.key}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                        type='number'
                                        label="Publication Year" 
                                        value={this.state.displayComic.year}
                                        onChange={(e) => {this.onYearChange(e.target.value)}}
                                        error={this.state.displayComic.year > 9999}
                                        margin="normal" 
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.displayComic.year > 9999 ? 'red' :
                                                Number(this.state.comic.year) === Number(this.state.displayComic.year) ? 'black' : 'green',
                                                width: "15ch"
                                            }
                                    }}/>
                                <TextField label="Story Title"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.comic.storyTitle === this.state.displayComic.storyTitle ? 'black' : 'green'}
                                          }}
                                        value={this.state.displayComic.storyTitle}
                                        onChange={(e) => this.onStoryTitleChange(e.target.value)}/>
                                <Autocomplete
                                    defaultValue={this.state.displayComic.publisher}
                                    onSelect={(e) => {this.onPublisherChange(e.target.value)}}
                                    freeSolo
                                    options={[...new Set(store.getState().data.publishers.sort((a, b) => a > b ? 1 : -1))]}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            label="Publisher"
                                            margin="normal"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {color: this.state.comic.publisher === this.state.displayComic.publisher ? 'black' : 'green'}
                                        }}/>
                                    )}/>
                                <div>
                                    <TextField
                                        type='number'
                                        label="Price Paid" 
                                        value={this.state.displayComic.pricePaid}
                                        onChange={(e) => this.onPricePaidChange(e.target.value)}
                                        onBlur={this.onPricePaidBlur}
                                        error={this.state.displayComic.pricePaid < 0.0}
                                        margin="normal" 
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.displayComic.pricePaid < 0.0 ? 'red' :
                                                this.state.comic.pricePaid === this.state.displayComic.pricePaid ? 'black' : 'green'},
                                            startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                            )
                                    }}/>
                                </div>
                                <div>
                                    <TextField
                                        type='number'
                                        label="Value" 
                                        value={this.state.displayComic.value}
                                        onChange={(e) => this.onValueChange(e.target.value)}
                                        onBlur={this.onValueBlur}
                                        error={this.state.displayComic.value < 0.0}
                                        margin="normal" 
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.displayComic.value < 0.0 ? 'red' :
                                                this.state.comic.value === this.state.displayComic.value ? 'black' : 'green'},
                                            startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                            )
                                    }}/>
                                </div>
                                <div>
                                    <TextField
                                        select
                                        label="Grade"
                                        margin="normal" 
                                        variant="outlined"
                                        value={this.state.displayComic.condition}
                                        onChange={(e) => this.onGradeChange(e.target.value)}
                                        InputProps={{
                                            style: {color: this.state.comic.condition === this.state.displayComic.condition ? 'black' : 'green'
                                            }
                                        }}>
                                        {grades.map((grade) => (
                                            <MenuItem value={grade}>
                                                {grade}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <TextField label="Notes"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: this.state.noteInput.length > MAX_NOTE_LENGTH ? 'red' : 'green'},
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button size="sm" variant={this.state.noteInput === "" ? "secondary" : "success"} disabled={this.state.noteInput === ""} onClick={(e) => this.onNoteSaveClick(this.state.comic.comicID)}>
                                                        <Icon icon="check"/>
                                                    </Button>
                                                </InputAdornment>
                                                )
                                          }}
                                        value={this.state.noteInput}
                                        onChange={(e) => {this.onNoteChange(e.target.value)}}
                                        error={this.state.noteInput.length > MAX_NOTE_LENGTH}
                                        helperText={"Notes must be " + MAX_NOTE_LENGTH + " characters or less."}/>
                                {
                                    this.state.displayComic.notes.sort((a, b) => a.notes > b.notes ? 1 : -1)
                                    .map((note, index) => {
                                        return <div>
                                            <TextField disabled
                                                label={"Note #" + (index + 1)}
                                                value={note.notes}
                                                margin="normal"
                                                variant="outlined"
                                                InputProps={{readOnly: true,
                                                    endAdornment:(
                                                        <InputAdornment position="end">
                                                            <Button variant="danger" size="sm" style={{float: 'right'}} onClick={(e) => this.onNoteDeleteClick(note.noteID)}>
                                                                <Icon icon="close"/>
                                                            </Button>
                                                        </InputAdornment>
                                                    )}} />
                                            </div>
                                    })
                                }
                                <TextField label="Picture"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{
                                            style: {color: !this.state.displayComic.picture || this.state.displayComic.picture.length > MAX_PICTURE_NAME_LENGTH ? 'red' :
                                                this.state.comic.picture === this.state.displayComic.picture ? 'black' : 'green'}
                                          }}
                                        value={this.state.displayComic.picture}
                                        onChange={(e) => this.onPictureChange(e.target.value)}
                                        error={this.state.displayComic.picture.length > MAX_PICTURE_NAME_LENGTH}
                                        helperText={"Picture name length must be " + MAX_PICTURE_NAME_LENGTH + " characters or less."}/>
                                <TextField disabled label="Last Updated" fullWidth value={this.state.displayComic.lastUpdated} margin="normal" variant="outlined" InputProps={{readOnly: true}} />
                                <TextField disabled label="Record Created" fullWidth value={this.state.displayComic.recordCreationDate} margin="normal" variant="outlined" InputProps={{readOnly: true}} />
                            </Form>
                        </div>
                        <div className="button-div">
                            <Button style={{margin:"10px"}} variant="outline-secondary" id="button-addon2" onClick={this.onHideClick}>
                                Close
                            </Button>
                            <Button style={{margin:"10px"}} variant="outline-secondary" id="button-addon2" onClick={this.onSaveChangesClick} disabled={this.state.loading || this.state.errors}>
                                Save Changes
                            </Button>
                        </div>
                    </Modal.Body>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Viewcomicmodal;
