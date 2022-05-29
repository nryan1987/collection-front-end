import { host } from "../../store/constants";

export default async function getFetchJWTAction(username, password) {
	const response = await fetch(host + "/user/login", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: username,
			password: password,
		}),
	});
	console.log("response ok: ", response.ok);
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	const jwtAction = {
		type: "UPDATE_JWT",
		payload: responseJson.jwt,
		message: responseJson.message,
		userSettings: responseJson.userSettings
	};
	return jwtAction;
}

export function getTokenFromLocalStorage() {
	var userToken = localStorage.getItem("user");
	var loginTime = localStorage.getItem("loginTime");
	var userSettings = localStorage.getItem("userSettings");
	var activeHours = 10;

	console.log("token", userToken);
	console.log("loginTime", loginTime);
	console.log("userSettings", JSON.stringify(userSettings));

	if(userToken && loginTime) {
		var expirationTime = loginTime + (activeHours*60*60*1000)

		if(Date.now() > expirationTime) { //Token expired. Clear localStorage.
			localStorage.clear();
			return null;
		} else {
			return {jwt: userToken, userSettings: userSettings};
		}
	}
}
