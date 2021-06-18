import React, { Component } from "react";
import { Navbar, Nav, Dropdown, Icon } from "rsuite";
import store from "../store/Store";
import "rsuite/dist/styles/rsuite-default.css";

class NavigationBar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var {username, jwt} = store.getState().user;
		return (
			<Navbar>
				<Navbar.Header>
					<a href="#" className="navbar-brand logo">
						Welcome {username}
					</a>
				</Navbar.Header>
				<Navbar.Body>
					<Nav>
						<Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
						<Nav.Item>News</Nav.Item>
						<Nav.Item>Products</Nav.Item>
						<Dropdown title="Token">
							<Dropdown.Item>{jwt}</Dropdown.Item>
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

export default NavigationBar;
