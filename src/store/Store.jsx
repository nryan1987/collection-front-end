import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducer/userReducer";
import dataReducer from "./reducer/dataReducer";
import { initialState } from "./constants";

const reducers = combineReducers({
	user: userReducer,
	data: dataReducer
});

const middleware = [thunk];
const store = createStore(
	reducers,
	initialState,
	compose(
		applyMiddleware(...middleware)
		//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

export default store;
