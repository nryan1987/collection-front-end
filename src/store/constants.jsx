export const host = process.env.REACT_APP_BACKEND_URL != null ? process.env.REACT_APP_BACKEND_URL : "http://localhost:8080";
export const pic_url = process.env.REACT_APP_COMIC_PICS_URL != null ? process.env.REACT_APP_COMIC_PICS_URL : "http://kandor/images/Comic_Pictures/";
export const maxMobilePagination = 5;

export const initialState = {
	username: "",
	password: "",
	jwt: "",
	userSettings: {}
};

//DB Constants
export const MAX_TITLE_LENGTH=60;
export const MAX_PICTURE_NAME_LENGTH=55;
export const MAX_NOTE_LENGTH=60;
export const MAX_INT_FIELD_LENGTH=999999999;

//Defaults
export const DEFAULT_FILE_EXTENSION='.jpg';

export const months = 
	[{key: "-01-01", value: "January"}, 
	{key: "-02-01", value: "February"}, 
	{key: "-03-01", value: "March"}, 
	{key: "-04-01", value: "April"}, 
	{key: "-05-01", value: "May"}, 
	{key: "-06-01", value: "June"}, 
	{key: "-07-01", value: "July"}, 
	{key: "-08-01", value: "August"}, 
	{key: "-09-01", value: "September"}, 
	{key: "-10-01", value: "October"}, 
	{key: "-11-01", value: "November"}, 
	{key: "-12-01", value: "December"}, 
	{key: "-03-20", value: "Spring"}, 
	{key: "-06-21", value: "Summer"}, 
	{key: "-09-22", value: "Fall"}, 
	{key: "-12-23", value: "Winter"}, 
	{key: "-12-30", value: "Annual"}, 
	{key: "-01-31", value: "Original Graphic Novel"}];

export const grades = [
	"MT 10.0",
	"MT 9.9",
	"NM/M 9.8",
	"NM+ 9.6",
	"NM 9.4",
	"NM- 9.2",
	"VF/NM 9.0",
	"VF+ 8.5",
	"VF 8.0",
	"VF- 7.5",
	"FN/VF 7.0",
	"FN+ 6.5",
	"FN 6.0",
	"FN- 5.5",
	"VG/FN 5.0",
	"VG+ 4.5",
	"VG 4.0",
	"VG- 3.5",
	"GD/VG 3.0",
	"GD+ 2.5",
	"GD 2.0",
	"GD- 1.8",
	"F/GD 1.5",
	"F 1.0",
	"PR 0.5"
];
