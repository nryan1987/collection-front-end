import React, { Component } from "react";
import NavigationBar from "./components/NavigationBar";
import store from "./store/Store";
import getLatestIssues from "./services/comicsService";
import Viewcomicmodal from './components/ViewComicModal';
import Carousel from 'react-bootstrap/Carousel';
import ImageCarousel from "./components/ImageCarousel";
import { View, Image, Text } from "react-native";
import { pic_url } from "./store/constants";
import { getTokenFromLocalStorage } from "./store/actions/jwtActions";
import "./css/MainMenu.css"

class MainMenu extends Component {
	pictureIntervalMS = 2000;
	constructor(props) {
		super(props);

		console.log("MainMenu props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { carouselSlides: [], isLoading: true, showComicModal: false };
	}

	componentDidMount() {
		this.getSlides();
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

			userSettings = JSON.parse(userSettings);
			getLatestIssues(userSettings.numRecentIssues, jwt).then(
				(latestIssues)=>{
					var slides = [];
					latestIssues.map((comic) => (slides.push(
					<View>
                    	<Image
                      	style={{
	                        borderColor: "dark grey",
    	                    borderWidth: 5,
        	                borderRadius: 20,
            	          resizeMode: "contain",
                	      height: 425,
                    	  width: 300
                      	}}
                      	source={pic_url + comic.picture}
                    	/>
                    	<Text>{comic.title + " VOL: " + comic.volume + " #" + comic.issue}</Text>
                  	</View>
				)));

				this.setState({ carouselSlides: slides });
				this.setState({isLoading: false});
			}
		);
		}
	}

	handleSlideClick = (selectedIndex) => {
		console.log(selectedIndex);

	}

	handleSelect = (selectedIndex, e) => {
		//Reload the image list after it goes through the whole list.
		if(selectedIndex === 0) {
			this.getSlides();
		}
	  };

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
				<Viewcomicmodal showModal={this.state.showComicModal} comic={this.state.selectedComic} onHide={this.hideComicModal}/>
			</div>
		);
	}
}

export default MainMenu;
