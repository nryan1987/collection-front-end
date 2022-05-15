import { initialState } from "../constants";

const userReducer = (state = initialState, action) => {
	console.log("reducer", action);

	switch (action.type) {
		case "UPDATE_USERNAME":
			return Object.assign({}, state, { username: action.payload });
		case "UPDATE_PASSWORD":
			return Object.assign({}, state, { password: action.payload });
		case "UPDATE_JWT":
			return Object.assign({}, state, { jwt: action.payload, userSettings: action.userSettings });
		default:
			return state;
	}
};

export default userReducer;
