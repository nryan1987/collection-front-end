import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import store from "../store/Store";
import { addComicList } from '../services/comicsService';
import { getTokenFromLocalStorage } from '../store/actions/jwtActions';
import "../css/Modal.css"

class AddComicsModal extends Component {
    constructor(props) {
		super(props);

        this.state = {
            loading: false,
            errors: false,
            errorMap: [],
            modalText: "No list to save"
        }
	}

    onSaveChangesClick = () => {
        this.setState({ loading: true });
        // var {jwt} = store.getState().user;
        var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			console.log("token expired");
			this.props.history.push("/");
		} else {
            addComicList(localStorage.jwt,this.props.comicsList).then((response)=>{
                this.setState({ loading: false });
                this.setState({ modalText: response.message });
                if(response.ok){
                    this.props.onSuccessfulAdd();
                }
                else {
                    this.setState({errorMap: response.errors});
                    this.setState({ errors: true });
                }
            });
        }
    }

    onHideClick = () => {
        this.setState({ errors: false });
        this.props.onHide();
    }

    render() {
        var modalBody = <Modal.Body>{this.state.modalText}</Modal.Body>;
        if(this.props.comicsList.length > 0 && this.state.errors == false){
            this.props.comicsList.sort(function (a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
                || a.volume > b.volume ? 1 : a.volume < b.volume ? -1 : 0 
                || a.issue > b.issue ? 1 : a.issue < b.issue ? -1 : 0;
            });
            if(this.state.loading){
                modalBody = <div>Loading...</div>;
            }
            else {
                modalBody = <div><Modal.Body>This will add {this.props.comicsList.length} comic(s) to the database. </Modal.Body>
                <ul>
                    {
                        this.props.comicsList.map(function(comic, index)
                            {
                                return <li key={index}>{comic.title} VOL. {comic.volume} #{comic.issue}</li>
                            }
                        )
                    }
                </ul>
                </div>;
            }
        }
        else if(this.state.errors) {
            modalBody = <div><Modal.Body>{this.state.modalText}</Modal.Body>
            <ul>
                {
                    this.state.errorMap.map(function(error, index)
                        {
                            return <li key={index}>{error.entity} - {error.errorMessage}</li>
                        }
                    )
                }
            </ul>
            </div>;
        }
        return (
            <div>
                <Modal style={{opacity:1}} show={this.props.showModal} onHide={this.props.onHide} backdrop="static">
                    <div className="scrollableModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Comics to Add</Modal.Title>
                    </Modal.Header>
                    {modalBody}
                    <Modal.Footer>
                        <button variant="secondary" onClick={this.onHideClick}>
                            Close
                        </button>
                        <button variant="primary" onClick={this.onSaveChangesClick} disabled={this.state.loading || this.props.comicsList.length <= 0 || this.state.errors}>
                            Save Changes
                        </button>
                    </Modal.Footer>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddComicsModal;
