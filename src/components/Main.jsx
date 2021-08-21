import React, { Component } from "react";
import LoginForm from "./LoginForm";
import MainMenu from "../MainMenu";
import EnterNewComic from "./EnterNewComic";
import { NavLink, Switch, Route } from "react-router-dom";

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
			</Switch>
		);
	}
}

const Home = () => (
	<div className="home">
		<h1>Welcome to my portfolio website</h1>
		<p> Feel free to browse around and learn more about me.</p>
	</div>
);

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
