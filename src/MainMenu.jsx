import React, { Component } from "react";
import { Navbar, Nav, Dropdown, Icon } from "rsuite";
import store from "./store/Store";
import getLast100Issues, { getOneIssue } from "./services/comicsService";
import getFetchJWTAction from "./store/actions/jwtActions";
import "rsuite/dist/styles/rsuite-default.css";

class MainMenu extends Component {
	constructor(props) {
		super(props);

		console.log("MainMenu props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { latest100: [], token: "default" };
	}

	componentDidMount() {
		console.log("MainMenu Component mounted");

		this.setState({ latest100: getLast100Issues() });
		console.log(this.state);
	}

	render() {
		return (
			<Navbar>
				<Navbar.Header>
					<a href="#" className="navbar-brand logo">
						RSUITE
					</a>
				</Navbar.Header>
				<Navbar.Body>
					<Nav>
						<Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
						<Nav.Item>News</Nav.Item>
						<Nav.Item>Products</Nav.Item>
						<Dropdown title="Token">
							<Dropdown.Item>{this.state.token.payload}</Dropdown.Item>
						</Dropdown>
						<Dropdown title="About">
							<Dropdown.Item>Company</Dropdown.Item>
							<Dropdown.Item>Team</Dropdown.Item>
							<Dropdown.Item>Contact</Dropdown.Item>
						</Dropdown>
					</Nav>
					<Nav pullRight>
						<Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
					</Nav>
				</Navbar.Body>
			</Navbar>
		);
	}
}

export default MainMenu;
