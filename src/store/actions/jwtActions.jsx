export default async function getFetchJWTAction(username, password) {
	console.log("getFetchJWTAction: ", username, password);

	const response = await fetch("http://localhost:8080/user/login", {
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
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	const jwtAction = {
		type: "UPDATE_JWT",
		payload: responseJson.jwt,
		message: responseJson.message,
	};
	return jwtAction;
}
