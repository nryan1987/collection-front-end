import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import store from "../store/Store";
import { addComicList } from '../services/comicsService';
import "../css/Modal.css"

class AddComicsModal extends Component {
    constructor(props) {
		super(props);

        this.state = {
            loading: false
        }
	}

    onSaveChangesClick = () => {
        this.setState({ loading: true });
        var {jwt} = store.getState().user;
        addComicList(jwt,this.props.comicsList).then((response)=>{
            console.log(response);
            this.setState({ loading: false });
            if(response.ok){
                this.props.onSuccessfulAdd();
            }
        });
        
    }

    render() {
        var modalBody = <Modal.Body>No list to save</Modal.Body>;
        if(this.props.comicsList.length > 0){
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
        return (
            <div>
                <Modal style={{opacity:1}} show={this.props.showModal} onHide={this.props.onHide} backdrop="static">
                    <div className="scrollableModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    {modalBody}
                    <Modal.Footer>
                        <button variant="secondary" onClick={this.props.onHide}>
                            Close
                        </button>
                        <button variant="primary" onClick={this.onSaveChangesClick} disabled={this.state.loading}>
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
