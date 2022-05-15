export const host = process.env.APP_URL != null ? process.env.APP_URL : "localhost:8080";
export default async function getFetchJWTAction(username, password) {
	console.log("host: ", host);
	console.log("getFetchJWTAction: ", username, password);

	const response = await fetch("http://" + host + "/user/login", {
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
