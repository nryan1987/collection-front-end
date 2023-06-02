import { initialState } from "../constants";

const dataReducer = (state = {}, action) => {
	console.log("reducer", action);

	switch (action.type) {
		case "UPDATE_PUBLISHERS":
			return Object.assign({}, state, { publishers: action.payload });
		default:
			return state;
	}
};

export default dataReducer;
