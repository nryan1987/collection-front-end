export default async function getLatestIssues(numIssues, jwt) {
	console.log("getLast100Issues - numIssues: ", numIssues);
	const response = await fetch("http://localhost:8080/comic/latestIssues", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
		body: numIssues,
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getOneIssue(id, {jwt}) {
	console.log("getOneIssue");

	const response = await fetch("http://localhost:8080/comic/"+id, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getCollectionStats(jwt) {
	console.log("getCollectionStats. token: " + jwt);

	const response = await fetch("http://localhost:8080/comic/collectionStats", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getTitlesAndPublishers(jwt) {
	console.log("getCollectionStats. token: " + jwt);

	const response = await fetch("http://localhost:8080/comic/titles", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function addComicList(jwt, comicArray) {
	console.log(comicArray);
	console.log(JSON.stringify(comicArray));

	const response = await fetch("http://localhost:8080/comic/addComics", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
		body: JSON.stringify(comicArray),
	});
	const responseJson = await response.json();

	var res = {
		...responseJson,
		status: response.status,
		ok: response.ok
	};

	return res;
}