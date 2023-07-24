import { host } from "../store/constants";
import { parseDateStr } from '../services/Utilities';

export default async function getHealthCheck() {
	const response = await fetch(host + "/app/healthCheck", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests"
		},
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});

	return response;
}

export async function getLatestIssues(numIssues, jwt) {
	console.log("getLast100Issues - numIssues: ", numIssues);
	const response = await fetch(host + "/comic/latestIssues", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
		body: numIssues,
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getIssuesByTitle(jwt, title) {
	console.log("getIssuesByTitle - title: ", title);
	let request = {
		title: title
	};
	const response = await fetch(host + "/comic/findByTitle", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
		body: JSON.stringify(request)
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getOneIssue(id, {jwt}) {
	const response = await fetch(host + "/comic/"+id, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();

	var res = {
		...responseJson,
		status: response.status,
		ok: response.ok
	};

	if(response.ok) {
		let dateObj = parseDateStr(res.publicationDate);
    	res.year = dateObj.year;
    	res.month = dateObj.month;
    	res.day = dateObj.day;
    	res.pricePaid = parseFloat(res.pricePaid).toFixed(2);
    	res.value = parseFloat(res.value).toFixed(2);
	}

	return res;
}

export async function getCollectionStats(jwt) {
	const response = await fetch(host + "/comic/collectionStats", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getTitlesAndPublishers(jwt) {
	const response = await fetch(host + "/comic/titles", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();
	console.log("json: ", responseJson);

	return responseJson;
}

export async function getDistinctTitles(jwt) {
	console.log("getting distinct titles...");
	const response = await fetch(host + "/comic/distinctTitles", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
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
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
		body: JSON.stringify(comicArray),
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();

	var res = {
		...responseJson,
		status: response.status,
		ok: response.ok
	};

	return res;
}

export async function updateComic(jwt, comic) {
	console.log(comic);
	console.log(JSON.stringify(comic));

	const response = await fetch(host + "/comic/updateComic", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
		body: JSON.stringify(comic),
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});
	const responseJson = await response.json();

	console.log("Update responseJson: ", responseJson);
	var res = {
		...responseJson,
		status: response.status,
		ok: response.ok
	};

	if(response.ok) {
		let dateObj = parseDateStr(res.publicationDate);
		res.year = dateObj.year;
		res.month = dateObj.month;
		res.day = dateObj.day;
		res.pricePaid = parseFloat(res.pricePaid).toFixed(2);
		res.value = parseFloat(res.value).toFixed(2);
	}

	return res;
}

export async function getAllComicsPaginated(jwt, pageNumber, pageSize, searchTerm) {
	console.log("Page Number: ", pageNumber);
	console.log("Page Size: ", pageSize);
	console.log("Search Term: ", searchTerm);

	let pageRequest = {
		pageNumber: pageNumber,
		pageSize: pageSize,
		searchTerm: searchTerm
	};

	const response = await fetch(host + "/comic/getComicsPage", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Content-Security-Policy": "upgrade-insecure-requests",
			"Authorization": "Bearer " + jwt
		},
		body: JSON.stringify(pageRequest)
	})
	.catch(error => {
		console.log(error);
		var res = {
			ok: false,
			error: error
		};
		return res;
	});

	const responseJson = await response.json();
	var res = {
		...responseJson,
		status: response.status,
		ok: response.ok
	};

	return res;
}