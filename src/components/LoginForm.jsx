import React, { Component } from "react";
import getFetchJWTAction from "../store/actions/jwtActions";
import { connect } from "react-redux";
import store from "../store/Store";
import heroes from "../images/heroes.gif"
import "../css/LoginForm.css"

class LoginForm extends Component {
	constructor(props) {
		super(props);

		console.log("LoginForm props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { isLoading: false };
	}

	handleLoginSubmit = (e) => {
		e.preventDefault();
		this.setState({isLoading: true});
		console.log("Login submit: ", this.props.history);
		
		getFetchJWTAction(
			store.getState().user.username,
			store.getState().user.password
		).then((jwtAction) => {
			console.log(jwtAction);
			if (jwtAction.payload === null) {
				alert(jwtAction.message);
				this.setState({isLoading: false});
			} else {
				this.props.updateJWT(this.props.history, jwtAction);
			}
		})
		.catch(
			(error) => {
				alert(error);
				this.setState({isLoading: false});
			}
		);
	};

	render() {
		return (
			<div className="mainDiv">
				<img src={heroes} />
				<h3>Sign In</h3>

				<form onSubmit={(e) => {this.handleLoginSubmit(e)}}>
				<div className="form-group">
					<input
						name="username"
						value={this.props.username}
						onChange={this.props.updateUserName}
						className="inputs"
						placeholder="Enter email address"
					/>
				</div>

				<div className="form-group">
					<input
						type="password"
						name="password"
						onChange={this.props.updatePassword}
						className="inputs"
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

				<input
					type="submit"
					className="btn btn-primary"
					value="Submit"
					disabled={this.state.isLoading}
				/>
				<p className="forgot-password text-right">
					Forgot <a href="#">password?</a>
				</p>
				</form>
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
		updateJWT: (history, jwtAction) => {
			dispatch(jwtAction);
			history.push("/main");
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
