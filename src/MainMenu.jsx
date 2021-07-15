import React, { Component } from "react";
import NavigationBar from "./components/NavigationBar";
import store from "./store/Store";
import getLatestIssues from "./services/comicsService";
import Carousel from 'react-bootstrap/Carousel';
import "./css/MainMenu.css"

class MainMenu extends Component {
	pictureIntervalMS = 2000;
	constructor(props) {
		super(props);

		console.log("MainMenu props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { carouselSlides: [], isLoading: true };
	}

	componentDidMount() {
		this.getSlides();
	}

	getSlides = () => {
		this.setState({isLoading: true});
		var {jwt} = store.getState().user;
		getLatestIssues(store.getState().user.userSettings.numRecentIssues, jwt).then(
			(latestIssues)=>{
				var slides = [];
				latestIssues.map((comic) => (slides.push(<Carousel.Item><img key={Date.now()} src={"http://kandor/images/" + comic.picture}
				alt={comic.title + " VOL: " + comic.volume + " #" + comic.issue} height='375px' width='250px'/>
				<Carousel.Caption><p className="carouselCaption">{comic.title + " VOL: " + comic.volume + " #" + comic.issue}</p></Carousel.Caption>
				</Carousel.Item>)));

				this.setState({ carouselSlides: slides });
				this.setState({isLoading: false});
			}
		);
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
			main = <Carousel interval={this.pictureIntervalMS} onSelect={this.handleSelect}> {this.state.carouselSlides} </Carousel>
		}
		return (			
			<div>
				<div className="mainMenuDiv">
					<NavigationBar history={this.props.history}/>
					{main}
				</div>
				<div className="bottom-container" style={{float:"left"}}>div2</div>
				<div className="bottom-container" style={{float:"right"}}>div3</div>
			</div>
		);
	}
}

export default MainMenu;
