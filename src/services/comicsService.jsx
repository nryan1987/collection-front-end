import { host } from "../store/constants";

export default async function getHealthCheck() {
	await fetch(host + "/app/healthCheck", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
	})
	.then(response => {
		console.log("json: ", response);
		return true;
	})
	.catch(error => {
		console.log(error);
		return false;
	}
	);
}

export async function getLatestIssues(numIssues, jwt) {
	console.log("getLast100Issues - numIssues: ", numIssues);
	const response = await fetch(host + "/comic/latestIssues", {
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

export async function getIssuesByTitle(jwt, title) {
	console.log("getIssuesByTitle - title: ", title);
	const response = await fetch(host + "/comic/findByTitle", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
		body: title,
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getOneIssue(id, {jwt}) {
	console.log("getOneIssue");

	const response = await fetch(host + "/comic/"+id, {
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

	const response = await fetch(host + "/comic/collectionStats", {
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

	const response = await fetch(host + "/comic/titles", {
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

	const response = await fetch(host + "/comic/addComics", {
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

export async function getAllComicsPaginated(jwt, pageNumber, pageSize, searchTerm) {
	console.log("Page Number: ", pageNumber);
	console.log("Page Size: ", pageSize);
	console.log("Search Term: ", searchTerm);

	const response = await fetch(host + "/comic/getComicsPage/"+pageNumber+"/"+pageSize, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + jwt
		},
		body: searchTerm
	});

	const responseJson = await response.json();
	var res = {
		...responseJson,
		status: response.status,
		ok: response.ok
	};

	return res;
}