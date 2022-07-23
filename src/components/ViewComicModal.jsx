import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ItemsCarousel from 'react-items-carousel';
import store from "../store/Store";
import Spinner from 'react-bootstrap/Spinner';
import { getOneIssue, getIssuesByTitle, updateComic } from '../services/comicsService';
import { getTokenFromLocalStorage } from '../store/actions/jwtActions';
import { pic_url, DEFAULT_FILE_EXTENSION } from '../store/constants';
import { mobileCheck, doesPictureExist } from '../services/Utilities';

function generatePictureFileName (title, volume, issue) {
    let fileName = title + "_" + volume + "_" + issue;
    const charactersToRemoveRegex = /[.:',]/g;
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
        this.state = {
            comic: null,
            displayComic: null,
            isLoading: false,
            errors: false,
            errorMap: [],
            showModal: false,
            activeItemIndex: 0,
            slides: [],
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
                    this.setState({comic: {...res}});
                    if(!res.picture) {
                        res.picture = generatePictureFileName(res.title, res.volume, res.issue);
                    }
                    this.setState({displayComic: {...res}});
                }
            );
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));

        if(this.props.comicID != 0) {
            this.setState({ isLoading: true });
            // var {jwt} = store.getState().user;
            var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            console.log("getting issue " + this.props.comicID);
            getOneIssue(this.props.comicID, localStorage).then(
                (res) => {
                    this.setState({comic: {...res}});
                    if(!res.picture) {
                        res.picture = generatePictureFileName(res.title, res.volume, res.issue);
                    }
                    this.setState({displayComic: {...res}});

            getIssuesByTitle(localStorage.jwt, res.title).then(
                    (res)=>{
                        console.log(res);
                        //if(res.ok) {
                            let slides = [];
                            res.map((c)=>{slides.push(
                                <div>
                                    <img key={Date.now()} src={pic_url + c.picture}
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
                            this.setState({ activeItemIndex: res.findIndex(c => c.comicID === this.state.comic.comicID)});
                        // }
                        // else {
                        //     alert(res.message);
                        // }
                    }
            );
                }
            );
        }
        }
    }

    onHideClick = () => {
        console.log("Hiding modal...");
        this.props.onHide();
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
                        if(res.ok) {
                            alert("Comic updated successfully.");
                            getOneIssue(this.state.displayComic.comicID, localStorage).then(
                                (res) => {
                                    this.setState({comic: {...res}});
                                    if(!res.picture) {
                                        res.picture = generatePictureFileName(res.title, res.volume, res.issue);
                                    }
                                    this.setState({displayComic: {...res}});
                                });
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
    }

    onVolumeChange = (newVolume) => {
        var comicCopy = this.state.displayComic;
        comicCopy.volume = newVolume;

        this.setState({displayComic: comicCopy});
    }

    onIssueChange = (newIssue) => {
        var comicCopy = this.state.displayComic;
        comicCopy.issue = newIssue;

        this.setState({displayComic: comicCopy});
    }

    onPictureChange = (newPic) => {
        var comicCopy = this.state.displayComic;
        comicCopy.picture = newPic;

        this.setState({displayComic: comicCopy});
    }

    render() {
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
            //gutter={12}
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
                                <Form.Group as={Row}>
                                    <Form.Label column>
                                        Comic ID
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly value={this.state.comic.comicID} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Title
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="text" style={this.state.comic.title === this.state.displayComic.title ? {color:'black'} : {color:'red'}} value={this.state.displayComic.title} onChange={(e) => {this.onTitleChange(e.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Volume
                                    </Form.Label>
                                    <Col sm="2">
                                        <Form.Control type="number" style={this.state.comic.volume === this.state.displayComic.volume ? {color:'black'} : {color:'red'}} value={this.state.displayComic.volume} onChange={(e) => {this.onVolumeChange(e.target.value)}} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Issue
                                    </Form.Label>
                                    <Col sm="2">
                                        <Form.Control type="number" step="0.1" style={this.state.comic.issue === this.state.displayComic.issue ? {color:'black'} : {color:'red'}} value={this.state.displayComic.issue} onChange={(e) => {this.onIssueChange(e.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Picture
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="text" style={this.state.comic.picture === this.state.displayComic.picture ? {color:'black'} : {color:'red'}} value={this.state.displayComic.picture} onChange={(e) => {this.onPictureChange(e.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column>
                                        Last Updated
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly value={this.state.comic.lastUpdated} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column>
                                        Record Created
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly value={this.state.comic.recordCreationDate} />
                                    </Col>
                                </Form.Group>
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
