import React, { Component } from "react";
import getFetchJWTAction from "../store/actions/jwtActions";
import { connect } from "react-redux";
import store from "../store/Store";

class LoginForm extends Component {
	constructor(props) {
		super(props);

		console.log("LoginForm props: ", this.props);
		console.log("Store:", store.getState());
	}

	componentDidMount() {
		console.log("Component mounted");
	}

	handleLoginSubmit = () => {
		console.log("Login submit: ", this.props.history);
		return this.props.updateJWT(this.props.history);
	};

	render() {
		return (
			<div>
				<h3>Sign In</h3>

				<div className="form-group">
					<label>Email address</label>
					<input
						name="username"
						value={this.props.username}
						onChange={this.props.updateUserName}
						className="form-control"
						placeholder="Enter username or email address"
					/>
				</div>

				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						name="password"
						onChange={this.props.updatePassword}
						className="form-control"
						placeholder="Enter password"
					/>
				</div>

				<div className="form-group">
					<div className="custom-control custom-checkbox">
						<input
							type="checkbox"
							className="custom-control-input"
							id="customCheck1"
						/>
						<label className="custom-control-label" htmlFor="customCheck1">
							Remember me
						</label>
					</div>
				</div>

				<button
					onClick={this.handleLoginSubmit}
					type="submit"
					className="btn btn-primary btn-block"
				>
					Submit
				</button>
				<p className="forgot-password text-right">
					Forgot <a href="#">password?</a>
				</p>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		username: state.username,
		password: state.password,
		jwt: state.jwt,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateUserName: (event) => {
			console.log("update username: ", event.target.value);
			const action = { type: "UPDATE_USERNAME", payload: event.target.value };
			dispatch(action);
		},
		updatePassword: (event) => {
			console.log("update password: ", event.target.value);
			const action = { type: "UPDATE_PASSWORD", payload: event.target.value };
			dispatch(action);
		},
		updateJWT: (history) => {
			console.log("update jwt", store.getState());
			getFetchJWTAction(
				store.getState().user.username,
				store.getState().user.password
			).then((jwtAction) => {
				console.log(jwtAction);
				if (jwtAction.payload === null) {
					alert(jwtAction.message);
				} else {
					dispatch(jwtAction);
					history.push("/main");
				}
			});
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
