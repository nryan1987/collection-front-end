const dataReducer = (state = {}, action) => {
	switch (action.type) {
		case "UPDATE_PUBLISHERS":
			return Object.assign({}, state, { publishers: action.payload });
		default:
			return state;
	}
};

export default dataReducer;
