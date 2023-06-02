import React, { Component } from "react";
import NavigationBar from "./components/NavigationBar";
import store from "./store/Store";
import { getLatestIssues } from "./services/comicsService";
import Viewcomicmodal from './components/ViewComicModal';
import Carousel from 'react-bootstrap/Carousel';
import ImageCarousel from "./components/ImageCarousel";
import { View, Image, Text } from "react-native";
import { pic_url } from "./store/constants";
import { getTokenFromLocalStorage } from "./store/actions/jwtActions";
import "./css/MainMenu.css"
import { TouchableOpacity } from "react-native-web";
import getFetchPublishersAction from "./store/actions/dataActions";
import { connect } from "react-redux";

class MainMenu extends Component {
	pictureIntervalMS = 2000;
	constructor(props) {
		super(props);

		console.log("MainMenu props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { carouselSlides: [], isLoading: true, selectedComicId: 0, showComicModal: false };
	}

	componentDidMount() {
		this.getSlides();

		var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			this.props.history.push("/");
		} else {
			var jwt = localStorage.jwt;
			console.log("jwt: ", jwt);
			getFetchPublishersAction(jwt).then((publisherAction) => {
				if (publisherAction.payload === null) {
					alert(publisherAction.message);
				} else {
					this.props.updatePublishers(publisherAction);
				}
			})
			.catch(
				(error) => {
					alert(error);
				}
			);
		}

		
	}

	getSlides = () => {
		this.setState({isLoading: true});
		// var {jwt} = store.getState().user;
		var localStorage = getTokenFromLocalStorage();
		if(!localStorage) {
			this.props.history.push("/");
		} else {
			var jwt = localStorage.jwt;
			var userSettings = localStorage.userSettings;

			var userSettingsJSON = JSON.parse(userSettings);
			getLatestIssues(userSettingsJSON.numRecentIssues, jwt).then(
				(latestIssues)=>{
					var slides = [];
					latestIssues.map((comic) => (slides.push(
					<View>
						<TouchableOpacity onPress={() => this.handleSlideClick(comic.comicID)}>
                    	<Image
                      	style={{
	                        borderColor: "dark grey",
    	                    borderWidth: 5,
        	                borderRadius: 20,
            	          resizeMode: "contain",
                	      height: undefined,
                    	  width: '95%',
						  aspectRatio: 1
                      	}}
                      	source={pic_url + comic.picture}
                    	/>
                    	<Text>{comic.title + " VOL: " + comic.volume + " #" + comic.issue}</Text>
						</TouchableOpacity>
                  	</View>
				)));

				this.setState({ carouselSlides: slides });
				this.setState({isLoading: false});
			}
		);
		}
	}

	handleSlideClick = (comicID) => {
		console.log(comicID);
		this.setState({selectedComicId: comicID});
        this.setState({showComicModal: true});
	}

	handleSelect = (selectedIndex, e) => {
		//Reload the image list after it goes through the whole list.
		if(selectedIndex === 0) {
			this.getSlides();
		}
	  };

	hideComicModal = () => {
        console.log("Updating showComicModal");
        this.setState({showComicModal: false});
    }

	render() {
		const isLoading = this.state.isLoading;
		var main = <div>Loading...</div>;
		if(!isLoading) {
			//main = <Carousel interval={this.pictureIntervalMS} onSelect={this.handleSelect}> {this.state.carouselSlides} </Carousel>
			main = <ImageCarousel slides={this.state.carouselSlides}/>
		}
		return (			
			<div>
				<div className="mainMenuDiv">
					<NavigationBar history={this.props.history}/>
					{main}
				</div>
				<div className="bottom-container" style={{float:"left"}}>div2</div>
				<div className="bottom-container" style={{float:"right"}}>div3</div>
				{ this.state.showComicModal ? 
                    <Viewcomicmodal showModal={this.state.showComicModal} comicID={this.state.selectedComicId} onHide={this.hideComicModal}/>
                    : 
                    null 
                }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		publishers: state.publishers,
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		updatePublishers: (publisherAction) => {
			dispatch(publisherAction);
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
