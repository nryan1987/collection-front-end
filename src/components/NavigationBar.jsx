import React, { Component } from "react";
import { Navbar, Nav, Dropdown, Icon } from "rsuite";
import store from "../store/Store";
import {getCollectionStats} from "../services/comicsService.jsx"
import "rsuite/dist/styles/rsuite-default.css";
import "../css/NavigationBar.css"

class NavigationBar extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			averagePricePaid: 0.0,
			averageValue: 0.0,
			countOfComics: 0,
			sumOfPricePaid: 0.0,
			sumOfValue: 0.0
		};
	}

	componentDidMount() {
		var {jwt} = store.getState().user;
		getCollectionStats(jwt).then(
			(stats)=>{
				this.setState({ averagePricePaid: stats.averagePricePaid });
				this.setState({ averageValue: stats.averageValue });
				this.setState({ countOfComics: stats.countOfComics });
				this.setState({ sumOfPricePaid: stats.sumOfPricePaid });
				this.setState({ sumOfValue: stats.sumOfValue });
			}
		);
	}

	goToPage(location) {
		console.log("location", location);
		this.props.history.push(location);
	}

	handleSettingsSelect = () => {
		console.log("Settings");
	}

	render() {
		var {username} = store.getState().user;
		return (
			<Navbar>
				<Navbar.Header>
					<a href="#" className="navbar-brand logo">
						Welcome {username}
					</a>
				</Navbar.Header>
				<Navbar.Body>
					<Nav>
						{/* <Nav.Item onSelect={this.logOutput} icon={<Icon icon="home" />}>Home</Nav.Item> */}
						{/* <NavLink href="/main">test</NavLink> */}
						<button
							onClick={() => {this.goToPage("/main")}}
							type="submit"
							className="btn navBarButton"
						>
							<Icon icon="home" />Home
						</button>
						<button
							onClick={() => {this.goToPage("/newComics")}}
							type="submit"
							className="btn navBarButton"
						>
							<Icon icon="plus" />Add new comics
						</button>
						{/* <Nav.Item onSelect={this.logOutput}>News</Nav.Item>
						<Nav.Item>Products</Nav.Item>
						<Dropdown title="Token">
							<Dropdown.Item>{jwt}</Dropdown.Item>
						</Dropdown>
						<Dropdown title="About">
							<Dropdown.Item>Company</Dropdown.Item>
							<Dropdown.Item>Team</Dropdown.Item>
							<Dropdown.Item>Contact</Dropdown.Item>
						</Dropdown> */}
					</Nav>
					<Nav pullRight>
						<Nav.Item>Total Comics: {this.state.countOfComics}</Nav.Item>
						<Nav.Item>Total Price Paid: ${this.state.sumOfPricePaid}</Nav.Item>
						<Nav.Item>Average Price Paid: ${this.state.averagePricePaid}</Nav.Item>
						<Nav.Item>Total Value: ${this.state.sumOfValue}</Nav.Item>
						<Nav.Item>Average Value: ${this.state.averageValue}</Nav.Item>
						<Nav.Item icon={<Icon icon="cog" />} onSelect={this.handleSettingsSelect}>Settings</Nav.Item>
					</Nav>
				</Navbar.Body>
			</Navbar>
		);
	}
}

export default NavigationBar;
