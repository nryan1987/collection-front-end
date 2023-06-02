import { host } from "../constants";

export default async function getFetchPublishersAction(jwt) {
    console.log("getFetchPublishersAction - ", jwt);
	const response = await fetch(host + "/publisher/getPublishers", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
		}
	});
	console.log("response ok: ", response.ok);
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	const publisherAction = {
		type: "UPDATE_PUBLISHERS",
		payload: responseJson.publishers,
		message: responseJson.message
	};
	return publisherAction;
}