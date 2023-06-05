import React, { Component } from "react";
import LoginForm from "./LoginForm";
import MainMenu from "../MainMenu";
import EnterNewComic from "./EnterNewComic";
import { Switch, Route } from "react-router-dom";
import AllComics from "./AllComics";

class Main extends Component {
	/*constructor(props) {
		super(props);
	}*/

	render() {
		return (
			<Switch>
				<Route exact path="/" component={LoginForm}></Route>
				<Route exact path="/main" component={MainMenu}></Route>
				<Route exact path="/about" component={About}></Route>
				<Route exact path="/contact" component={Contact}></Route>
				<Route exact path="/newComics" component={EnterNewComic}></Route>
				<Route exact path="/allComics" component={AllComics}></Route>
			</Switch>
		);
	}
}

const About = () => (
	<div className="about">
		<h1>About Me</h1>
		<p>
			Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident
			corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum
			molestias?
		</p>
		<p>
			Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident
			corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum
			molestias?
		</p>
	</div>
);

const Contact = () => (
	<div className="contact">
		<h1>Contact Me</h1>
		<p>
			You can reach me via email: <strong>hello@example.com</strong>
		</p>
	</div>
);

export default Main;
