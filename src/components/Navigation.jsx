import { Component } from "react";
import { NavLink } from "react-router-dom";

class Navigation extends Component {
	render() {
		return (
			<nav>
				<ul>
					<li>
						<NavLink exact activeClassName="current" to="/about">
							About
						</NavLink>
					</li>
					<li>
						<NavLink exact activeClassName="current" to="/contact">
							Contact
						</NavLink>
					</li>
				</ul>
			</nav>
		);
	}
}

export default Navigation;
