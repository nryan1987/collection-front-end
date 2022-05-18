import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ItemsCarousel from 'react-items-carousel';
import store from "../store/Store";
import Spinner from 'react-bootstrap/Spinner';
import { getOneIssue, getIssuesByTitle } from '../services/comicsService';
import { pic_url } from '../store/constants';
  

class Viewcomicmodal extends Component {
    constructor(props) {
		super(props);

        this.state = {
            comic: this.props.comic,
            isLoading: false,
            errors: false,
            errorMap: [],
            comicTitle: "",
            comicVolume: 0,
            comicIssue: 0,
            picture: "",
            showModal: false,
            name: "",
            activeItemIndex: 0,
            slides: []
        }
	}

    clickSlide = (comicID) => {
        console.log("Slide click: " + comicID);

        getOneIssue(comicID, store.getState().user).then(
            (res) => {
                console.log(res);
                this.setState({comic: res});
            }
        );
    }

    componentDidMount() {
        if(this.state.comic != null) {
            this.setState({ isLoading: true });
            var {jwt} = store.getState().user;
            console.log("Querying series...");
            getIssuesByTitle(jwt, this.state.comic.title).then(
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
    }

    onHideClick = () => {
        console.log("Hiding modal...");
        this.props.onHide();
    }

    onSaveChangesClick = () => {
        console.log("Save button clicked.");
    }

    onTitleChange = (newTitle) => {
        var comicCopy = this.state.comic;
        comicCopy.title = newTitle;

        this.setState({comic: comicCopy});
    }

    onVolumeChange = (newVolume) => {
        var comicCopy = this.state.comic;
        comicCopy.volume = newVolume;

        this.setState({comic: comicCopy});
    }

    onIssueChange = (newIssue) => {
        var comicCopy = this.state.comic;
        comicCopy.issue = newIssue;

        this.setState({comic: comicCopy});
    }

    render() {
        if(this.state.comic == null) {
            return(null);
        }

        var carousel;
        if(this.state.isLoading) {
            carousel = <Spinner animation="border" role="status"></Spinner>;
        }
        else {
            carousel = <ItemsCarousel
            infiniteLoop={false}
            gutter={12}
            activePosition={'center'}
            chevronWidth={60}
            disableSwipe={false}
            alwaysShowChevrons={false}
            numberOfCards={5}
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
                            <img key={Date.now()} src={pic_url + this.state.comic.picture}
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
                                        <Form.Control type="text" value={this.state.comic.title} onChange={(e) => {this.onTitleChange(e.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Volume
                                    </Form.Label>
                                    <Col sm="2">
                                        <Form.Control type="number" value={this.state.comic.volume} onChange={(e) => {this.onVolumeChange(e.target.value)}} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Issue
                                    </Form.Label>
                                    <Col sm="2">
                                        <Form.Control type="number" step="0.1" value={this.state.comic.issue} onChange={(e) => {this.onIssueChange(e.target.value)}}/>
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
