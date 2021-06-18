import React, { Component } from "react";
import NavigationBar from "./components/NavigationBar";
import store from "./store/Store";
import getLast100Issues from "./services/comicsService";
import {Carousel} from '3d-react-carousal';
import { isCompositeComponent } from "react-dom/cjs/react-dom-test-utils.production.min";


class MainMenu extends Component {
	constructor(props) {
		super(props);

		console.log("MainMenu props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { latest100: [], isLoading: true };
	}

	componentDidMount() {
		console.log("MainMenu Component mounted");
		var {jwt} = store.getState().user;
		getLast100Issues(jwt).then(
			(last100Issues)=>{
				console.log(last100Issues);
				var slides = [];
				last100Issues.map((comic) => (slides.push(<img  src={"http://kandor/images/" + comic.picture}
				alt={comic.title + " VOL: " + comic.volume + " #" + comic.issue } height='375px' width='250px'/>)));
				console.log(slides);

				this.setState({ latest100: slides });
				this.setState({isLoading: false});
			}
		);

		try{
		setInterval(async () => {
			const last100Issues = await getLast100Issues(jwt);
			var slides = [];

			console.log(last100Issues);
			last100Issues.map((comic) => (slides.push(<img key={Date.now()} src={"http://kandor/images/" + comic.picture}
			alt={comic.title + " VOL: " + comic.volume + " #" + comic.issue } height='375px' width='250px'/>)));
			console.log(slides);

			this.setState({ latest100: slides });
			this.setState({isLoading: false});
		  }, 2000 * 100);
		} catch(e) {
		  console.log(e);
		}
	}

	render() {
		const isLoading = this.state.isLoading;
		var main = <div>Loading...</div>;
		if(!isLoading) {
			main = <Carousel slides={this.state.latest100} autoplay={true} interval={2000}/>
			//console.log(this.state.latest100);
		}
		return (			
			<div>
				<div className="mainMenuDiv">
					<NavigationBar/>
					div1
					{console.log(this.state.latest100)}
					{main}
				</div>
				<div className="bottom-container" style={{float:"left"}}>div2</div>
				<div className="bottom-container" style={{float:"right"}}>div3</div>
			</div>
		);
	}
}

export default MainMenu;
