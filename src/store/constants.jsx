export const host = process.env.REACT_APP_BACKEND_URL != null ? process.env.REACT_APP_BACKEND_URL : "http://localhost:8080";
export const pic_url = process.env.REACT_APP_COMIC_PICS_URL != null ? process.env.REACT_APP_COMIC_PICS_URL : "http://kandor/images/Comic Pictures/";

export const initialState = {
	username: "",
	password: "",
	jwt: "",
	userSettings: {}
};

//DB Constants
export const MAX_TITLE_LENGTH=60;