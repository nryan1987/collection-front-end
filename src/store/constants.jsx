export const host = process.env.REACT_APP_BACKEND_URL != null ? process.env.REACT_APP_BACKEND_URL : "http://localhost:8080";

export const initialState = {
	username: "",
	password: "",
	jwt: "",
	userSettings: {}
};
